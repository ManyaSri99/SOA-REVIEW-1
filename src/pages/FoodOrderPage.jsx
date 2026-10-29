import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { foodOrderService } from '../services/foodOrderService';

const menuItems = [
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    category: 'Starters',
    description: 'Smoky tandoor-grilled paneer with peppers and mint chutney.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85',
    vegetarian: true,
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    category: 'Mains',
    description: 'Slow-cooked chicken in a creamy tomato and cashew gravy.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85',
    vegetarian: false,
  },
  {
    id: 'veg-biryani',
    name: 'Vegetable Biryani',
    category: 'Mains',
    description: 'Fragrant basmati rice layered with seasonal vegetables and raita.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85',
    vegetarian: true,
  },
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    category: 'Mains',
    description: 'Crisp rice crepe filled with spiced potato, served with sambar.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=85',
    vegetarian: true,
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    category: 'Desserts',
    description: 'Rich chocolate layer cake served with a light cream topping.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85',
    vegetarian: true,
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    category: 'Drinks',
    description: 'Chilled yogurt blended with sweet mango.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=900&q=85',
    vegetarian: true,
  },
];

const FoodOrderPage = () => {
  const { user } = useAuth();
  const [roomNumber, setRoomNumber] = useState('');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateCartItem = (itemId, updates) => {
    setCart((items) => items.map((item) => (
      item.id === itemId ? { ...item, ...updates } : item
    )));
  };

  const addToCart = (menuItem) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === menuItem.id);
      if (existing) {
        return items.map((item) => (
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }

      return [...items, {
        ...menuItem,
        quantity: 1,
        spiceLevel: 'Medium',
        specialInstructions: '',
      }];
    });
    setMessage('');
    setError('');
  };

  const removeFromCart = (itemId) => {
    setCart((items) => items.filter((item) => item.id !== itemId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!roomNumber.trim()) {
      setError('Enter your room number so we can deliver your order.');
      return;
    }

    if (cart.length === 0) {
      setError('Add at least one menu item before placing your order.');
      return;
    }

    try {
      const order = foodOrderService.placeOrder({
        customerName: user?.name || user?.username || 'Guest',
        customerEmail: user?.email || '',
        roomNumber: roomNumber.trim(),
        items: cart.map(({ id, name, price, quantity, spiceLevel, specialInstructions }) => ({
          id,
          name,
          price,
          quantity,
          spiceLevel,
          specialInstructions: specialInstructions.trim(),
        })),
        total,
      });

      setMessage(`Order ${order.id} sent to the hotel team. We’ll deliver it to room ${order.roomNumber}.`);
      setCart([]);
    } catch (orderError) {
      setError(orderError.message || 'Your order could not be saved. Please try again.');
    }
  };

  return (
    <div className="page-shell food-order-page">
      <header className="food-page-header">
        <div>
          <span className="eyebrow eyebrow-dark">GrandVista room service</span>
          <h1>Good food, delivered to your room.</h1>
          <p>Choose your favorites and make them yours. Our kitchen will take it from here.</p>
        </div>
        <div className="food-service-note"><span aria-hidden="true">🛎️</span> Made fresh · Delivered to your door</div>
      </header>

      {message ? <div className="food-alert food-alert-success" role="status">{message}</div> : null}
      {error ? <div className="food-alert food-alert-error" role="alert">{error}</div> : null}

      <div className="food-order-layout">
        <section>
          <div className="food-section-heading">
            <div>
              <h2>Our menu</h2>
              <p>Freshly prepared, just for you.</p>
            </div>
            <span>{menuItems.length} delicious choices</span>
          </div>
          <div className="food-menu-grid">
            {menuItems.map((item) => {
              const cartItem = cart.find((entry) => entry.id === item.id);

              return (
                <article className="food-menu-card" key={item.id}>
                  <img className="food-menu-image" src={item.image} alt={item.name} loading="lazy" />
                  <div className="food-menu-content">
                    <div className="food-menu-meta">
                      <span>{item.category}</span>
                      <span className={item.vegetarian ? 'food-diet veg' : 'food-diet'}>{item.vegetarian ? 'Veg' : 'Non-veg'}</span>
                    </div>
                    <div className="food-title-price">
                      <h3>{item.name}</h3>
                      <strong>₹{item.price}</strong>
                    </div>
                    <p>{item.description}</p>
                    {cartItem ? (
                      <div className="food-customize">
                        <label>
                          Spice level
                          <select
                            value={cartItem.spiceLevel}
                            onChange={(event) => updateCartItem(item.id, { spiceLevel: event.target.value })}
                          >
                            <option>Mild</option>
                            <option>Medium</option>
                            <option>Hot</option>
                          </select>
                        </label>
                        <label>
                          Customize this dish
                          <input
                            type="text"
                            maxLength="120"
                            placeholder="e.g. no onion, extra sauce"
                            value={cartItem.specialInstructions}
                            onChange={(event) => updateCartItem(item.id, { specialInstructions: event.target.value })}
                          />
                        </label>
                        <div className="food-quantity-control" aria-label={`${item.name} quantity`}>
                          <button
                            type="button"
                            onClick={() => cartItem.quantity > 1
                              ? updateCartItem(item.id, { quantity: cartItem.quantity - 1 })
                              : removeFromCart(item.id)}
                            aria-label={`Remove one ${item.name}`}
                          >−</button>
                          <span>{cartItem.quantity}</span>
                          <button type="button" onClick={() => updateCartItem(item.id, { quantity: cartItem.quantity + 1 })} aria-label={`Add one ${item.name}`}>+</button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className="btn btn-primary food-add-button" onClick={() => addToCart(item)}>
                        Add to order <span aria-hidden="true">＋</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="card food-cart">
          <div>
            <span className="eyebrow eyebrow-dark">Your order</span>
            <h2>Room delivery</h2>
            <p className="food-cart-caption">Your food will be brought straight to your door.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Room number
              <input
                type="text"
                value={roomNumber}
                onChange={(event) => setRoomNumber(event.target.value)}
                placeholder="e.g. 204"
                maxLength="20"
                required
              />
            </label>
            <div className="food-cart-items">
              {cart.length ? cart.map((item) => (
                <div className="food-cart-item" key={item.id}>
                  <div>
                    <strong>{item.quantity} × {item.name}</strong>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')} · {item.spiceLevel}</span>
                    {item.specialInstructions ? <small>{item.specialInstructions}</small> : null}
                  </div>
                  <button type="button" className="food-remove-button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>Remove</button>
                </div>
              )) : <p className="food-empty-cart">Your order is empty. Add something tasty from the menu.</p>}
            </div>
            <div className="food-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
            <button type="submit" className="btn btn-primary food-submit-button" disabled={!cart.length}>Place room-service order</button>
            <small className="food-cart-footnote">The manager will receive your order as soon as you place it.</small>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default FoodOrderPage;
