import './ProductView.css';
//esta es una vista independiente
function ProductView(){
    return(
        <main className ="product-container">
            {/* titulo del producto */}

            <header className="prodcut-header">
                <h1>Paracetamol 500 mg</h1>
            </header>

            {/* Contenido principal */}
            <section className="product-content">
                {/* Imagen */}
                <div className="product-image">
                    <img
                    src="/producto.png"
                    alt="imagen del producto"
                    />
                </div>
                <div className="product-description">

                    <h2>Descripcion</h2>

                    <p>Medicamento utilizado para aliviar dolores 
                        leves a moderados y reducir la fiebre 
                    </p>

                    <h3>Presentacion</h3>
                    <p>Tabletas de 500 mg</p>

                    <h3>Categoria</h3>
                    <p>Medicamentos</p>

                    <h3>Existencias</h3>
                    <p>Disponibilidad</p>

                </div>
                </section>
        </main>
    );
}

export default ProductView;