# Código 3.11 - Astrología Evolutiva

Bienvenidos a la Aplicación de **Código 3.11 - Astrología Evolutiva**, un Portal dedicado a la Consultoría Astrológica y diversos Cursos en Línea. 
Esta Aplicación permite a los Usuarios registrarse, reservar Consultas Astrológicas y adquirir Cursos On-Demand.



## Tecnologías y Bibliotecas Utilizadas --->

- **React+Vite**: Biblioteca Principal para la Construcción de la Interfaz de Usuario.
- **React Router DOM**: Para el Enrutamiento y la Navegación dentro de la Aplicación.
- **React Bootstrap**: Para Componentes de UI estilizados con Bootstrap.
- **FontAwesome**: Para Iconos en la Interfaz de Usuario.
- **React Icons**: Para Iconos Adicionales en la Interfaz de Usuario.
- **Firebase**: Para la Autenticación, Almacenamiento de Datos en Firestore y Manejo de Pedidos.
- **React Context API**: Para el Manejo del Estado Global (Carrito y Autenticación).
- **Bootstrap**: Para Estilos y Diseño Responsivo.
- **React DatePicker**: Componente para la Selección de Fechas en los Formularios de Reserva.
- **Material-UI (MUI)**: Biblioteca de componentes de React que proporciona un conjunto de Componentes predefinidos que siguen las directrices de Material Design. Utilizado para mejorar la Apariencia y la Funcionalidad de la interfaz de Usuario.
- **Formik**: Biblioteca para el Manejo de Formularios en React. Simplifica la Gestión del Estado del Formulario, la Validación y el Manejo de Envíos.



## Estructura del Proyecto --->

### Directorio `src`

- **`components/`**: Contiene todos los Componentes Reutilizables de la Aplicación.

  - `NavBar.jsx`: Barra de Navegación principal con Enlaces y Carrito de Compras.
  - `CartWidget.jsx`: Widget que muestra el Número de elementos en el Carrito.

  - `Home.jsx`: Página Principal de Bienvenida con Acceso a las Categorías establecidas de los Servicios.

  - `Item.jsx`: Componente que representa un Ítem con Imagen, Título, Categpría y Enlace para ver sus Detalles.
  - `ItemListContainer.jsx`: Muestra la Lista de Ítems en una Categoría específica.

  - `ItemDetail.jsx`: Componente que muestra los Detalles Completos de un Ítem. Imagen, Descripción, Precio, Stock.
  - `ItemDetailContainer.jsx`: Obtiene y Muestra los Detalles de un Ítem. 

  - `ItemCount.jsx`: Componente para Controlar la Cantidad de un Ítem a Agregar al Carrito. Se Deshabilita y/o Habilita según Disponibilidad de Stock.

  - `ItemCalendar.jsx`: Componente para la Reserva de Turnos para Consultorías Astrológicas.

  - `CrearCuenta.jsx`: Formulario para Crear una Nueva Cuenta.
  - `Ingresar.jsx`: Formulario para Iniciar Sesión.

  - `Cart.jsx`: Componente del Carrito de Compras. Permite Sumar / Restar Unidades de Cursos según Stock Disponible; Eliminar Reservas efectuadas o Cursos previamente añadidos a Carrito.

  - `Checkout.jsx`: Componente para Mostrar el Detalle de lo añadido al Carrito y su posterior Proceso de Compra. Validación de Datos al Ingresar o Crear Cuenta y Obtención del N° de Pedido para el Usuario.

  - `Footer.jsx`: Pie de Página de la Aplicación.

  - `NotFound.jsx`: Página de Error 404 para Rutas no encontradas.
 

### Carpetas --->

- **`context/`**: Contextos para el Manejo del Estado Global.
  - `CartContext.jsx`: Contexto para el Carrito de Compras.
  - `AuthContext.jsx`: Contexto para la Autenticación de Usuarios.


- **`styles/`**: Archivos de Estilo CSS para personalizar la Apariencia de la Aplicación.


- **`assets/`**: Recursos estáticos como Imágenes y Logotipos.


- **`App.jsx`**: Componente Principal que define las Rutas y el Layout General de la Aplicación.


- **`main.jsx`**: Archivo de Entrada que renderiza el Componente `App` en el DOM.



## Integración con Firebase

### **Base de Datos**

La Aplicación utiliza Firebase Firestore para gestionar la Base de Datos. 
Los Datos de los Cursos y de las Consultas se almacenan en Firestore, permitiendo un acceso rápido y seguro a la información.



### **Gestión de Pedidos**

Cuando un Usuario realiza una Compra, se sigue el siguiente flujo:

1. **Creación de Pedido**: 
   - Al completar el proceso de Checkout, la Aplicación crea un Nuevo Documento en una Colección llamada `ItemCollectionII` en Firestore.
   - Este Documento incluye Información sobre el Usuario; como Nombre, Email y Teléfono; junto con los Ítems Comprados en Detalle; su Cantidad, el Total del Pedido y la Fecha en que se realiza.

2. **Generación del ID de Pedido**:
   - Firebase Firestore genera un ID único para cada Nuevo Pedido, que se usa como Número de Orden.
   - Este ID es asignado al Pedido y se utiliza para rastrear el estado del mismo.

3. **Actualización del Carrito**:
   - Tras la Confirmación del Pedido, el Carrito se limpia y se actualizan los Datos Relevantes en la Base de Datos / Utilización de LocalStorage.

4. **Notificación al Usuario**:
   - El Usuario recibe una Confirmación con el Número de Orden generado.



## Navegación

1. **Autenticación**:
   - Utiliza el Componente `CrearCuenta` para Registrarte.
   - Usa `Ingresar` para Iniciar Sesión.

2. **Navegación**:
   - La Barra de Navegación permite Acceder a diferentes Secciones como Home, Consultoría Astrológica y Cursos On Demand. Desde Home también podés Acceder a los Servicios!
   - El Carrito de Compras muestra los elementos seleccionados y permite realizar el Checkout.



## Funcionalidades

- **Registro y Autenticación**: Permite a los Usuarios Crear una Cuenta y Autenticarse.
- **Gestión del Carrito**: Los Usuarios pueden Agregar, Actualizar y Eliminar elementos del Carrito.
- **Consultoría y Cursos**: Los Usuarios pueden Explorar y Reservar Servicios de Consultoría Astrológicas y Cursos en Línea.
- **Checkout**: Proceso para Finalizar la Compra de los Servicios y Cursos, incluyendo la Creación de un Pedido en Firestore.



## Estilo y Diseño

La Aplicación utiliza Bootstrap para el Diseño Responsivo; pero, tiene estilos sumamente propios y personalizados en CSS para ajustar la apariencia según las necesidades específicas.
