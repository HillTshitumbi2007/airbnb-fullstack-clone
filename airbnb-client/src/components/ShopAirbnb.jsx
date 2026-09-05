function ShopAirbnb() {
  const products = [
    {
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      title: "Airbnb Collection",
      description: "Bring the Airbnb feeling home.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
      title: "Home essentials",
      description: "Discover products inspired by beautiful stays.",
    },
  ];

  return (
    <section className="shop-section">
      <h2>Shop Airbnb</h2>

      <div className="shop-grid">
        {products.map((product, index) => (
          <div className="shop-card" key={index}>
            <img src={product.image} alt={product.title} />

            <div className="shop-card-content">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShopAirbnb;