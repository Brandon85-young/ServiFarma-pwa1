import './ProductView.css';
/*esta es una vista independiente*/
function ProductView(){
    return(
        <main className ="product-container"> /*product-container; contiene toda nuestra vista*/
            {/* titulo del producto */}

            <header className="prodcut-header">/*product-header; contiene el titulo*/
                <h1>Paracetamol 500 mg</h1>
            </header>

            {/* Contenido principal */}
            <section className="product-content">/*product-content; agrupa imagen y descripcion*/
                {/* Imagen */}
                <div className="product-image">/*product-image; contiene la imagen*/
                    <img
                    src="/producto.png"
                    alt="imagen del producto"
                    />
                </div>
                <div className="product-description">/*product-description; contiene los datos */

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