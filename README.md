<div align="center" id="readme-top">
  <a href="https://github.com/gomisroca/oura">
    <img src="banner.webp" alt="Logo" width="300" height="100">
  </a>

<h3 align="center">OURA</h3>

  <p align="center">
    Oura is a sports clothing store website with a high level of customization and a user-friendly interface. It offers a wide range of products, including clothing, shoes, and accessories, with various sizes, colors, and styles. The website is designed to be easy to navigate and offers a secure payment system for customers to make purchases.
    <br />
    <a href="https://github.com/gomisroca/oura"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://oura-clothing.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/gomisroca/oura/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/gomisroca/oura/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#api-specification">API Specification (tRPC)</a>
      <ul>
        <li><a href="#procedure-types">Procedure Types</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#sales">Sales</a></li>
        <li><a href="#categories">Categories</a></li>
        <li><a href="#cart">Cart</a></li>
        <li><a href="#checkout">Checkout</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
<h2 id="about-the-project">📡 About The Project</h2>

![Oura Screen Shot](screenshot.webp)

The project is a web application that allows the creation of a full-fledged clothing store.  
As the admin user, you will be able to create products, categories for said products, sales, and handle the checkout process.   
Note the project is tailored for clothing products, and using it for other products may require some adjustments to the codebase. More details [here](#adjusting-the-codebase).


### Built With
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase Badge](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff&style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)  
![Stripe](https://img.shields.io/badge/Stripe-5469d4?style=for-the-badge&logo=stripe&logoColor=ffffff)
![tRPC](https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=tRPC&logoColor=white)
![Zod Badge](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=fff&style=for-the-badge)  
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- GETTING STARTED -->
<h2 id="getting-started">📋 Getting Started</h2>

Follow these steps to get your own local copy of the project up and running.

<h3 id="prerequisites">Prerequisites</h3>

Make sure you have node.js and npm installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```
Beyond this, if you plan on adjusting the codebase, you might need some knowledge of TypeScript, React, Next.js, Next Auth, tRPC, Zod or Prisma depending on the changes you want to make.

<h3 id="installation">Installation</h3>

1. Set up your login providers. By default, we use [Google OAuth](https://console.cloud.google.com) and [Magic Links via Email](https://next-auth.js.org/providers/email). If you want to use different login methods, you will have to adjust the codebase accordingly. More details [here](#login-providers).
2. Set up your database. By default, we use PostgreSQL via Prisma. If you want to use a different database, you will have to adjust the codebase accordingly. More details [here](#database-options).
3. Set up image hosting. By default, we use Supabase Buckets. If you want to use a different image hosting service, you will have to adjust the codebase accordingly. More details [here](#image-hosting).
4. Clone the repo
   ```sh
   git clone https://github.com/gomisroca/oura.git
   ```
5. Install NPM packages
   ```sh
   npm install
   ```
6. Check `.env.example` and create an `.env` file
   ```js
   DATABASE_URL="postgresql://postgres:password@localhost:5432/oura"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/oura"
   etc...
   ```
7. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- USAGE EXAMPLES -->
<h2 id="usage">💠 Usage</h2>

You can run the project in development mode from the main folder with **npm run dev**.  

After initializing the database, run **npm run db:push** to apply the Prisma schema.  
Optionally, run **npm run db:seed** to seed the database with some sample data.  

All necessary environment variables can be found in **.env.example**.

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

To get started uploading your own data directly from the website, initialize the database and log into the website. Afterwards, find your user in the database and give yourself admin privileges. You can now access the admin panel at **/admin**.

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- API SPECIFICATION -->
<h2 id="api-specification">🚀 API Specification (tRPC)</h2>
  This project uses **tRPC** for type-safe API procedures. All API calls are end-to-end type-checked, providing compile-time safety and excellent developer experience.

<h3 id="procedure-types">Procedure Types</h3>

  * **QUERY**: Read operations (fetching data)  
  * **CREATE**: Create new resources  
  * **UPDATE**: Modify existing resources  
  * **DELETE**: Remove resources  

<h3 id="products">📦 Products</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `visit` | Increment product view count | ID | Product |
| QUERY | `getUnique` | Get a unique product | ID | Product |
| QUERY | `getAll` | Get all products | Gender? | Product[] |
| QUERY | `getBySport` | Get products by sport | Sport ID, Gender? | Product[] |
| QUERY | `getByCategory` | Get products by category | Category ID, Gender? | Product[] |
| QUERY | `getBySubcategory` | Get products by subcategory | Subcategory ID, Gender? | Product[] |
| CREATE | `create` | Create a product | Product Data | Product |
| UPDATE | `update` | Update a product | Product Data | Product |
| DELETE | `delete` | Delete a product | ID | Boolean |

</details>

<h3 id="sales">💲 Sales</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUnique` | Get a unique sale | ID | Sale |
| QUERY | `getAll` | Get all sales | | Sale[] |
| QUERY | `get` | Get ongoing sale with details | Gender? | Sale |
| QUERY | `getProductsBySport` | Get products on sale by sport | Sport ID, Gender? | Sale |
| QUERY | `getProductsByCategory` | Get products on sale by category | Category ID, Gender? | Sale |
| QUERY | `getProductsBySubcategory` | Get products on sale by subcategory | Subcategory ID, Gender? | Sale |
| CREATE | `create` | Create a sale | Sale Data | Sale |
| UPDATE | `update` | Update a sale | Sale Data | Sale |
| DELETE | `delete` | Delete a sale | ID | Boolean |

</details>

<h3 id="categories">📚 Categories</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUniqueSport` | Get a unique sport | ID | Sport |
| QUERY | `getUniqueCategory` | Get a unique category | ID | Category |
| QUERY | `getUniqueSubcategory` | Get a unique subcategory | ID | Subcategory |
| QUERY | `getSports` | Get all sports | Gender?, Sale? | Sport[] |
| QUERY | `getCategories` | Get all categories | Sport ID?, Gender?, Sale? | Category[] |
| QUERY | `getSubcategories` | Get all subcategories | Category ID?, Gender?, Sale? | Subcategory[] |
| CREATE | `createSport` | Create a sport | Sport Data | Sport |
| CREATE | `createCategory` | Create a category | Category Data | Category |
| CREATE | `createSubcategory` | Create a subcategory | Subcategory Data | Subcategory |
| UPDATE | `updateSport` | Update a sport | Sport Data | Sport |
| UPDATE | `updateCategory` | Update a category | Category Data | Category |
| UPDATE | `updateSubcategory` | Update a subcategory | Subcategory Data | Subcategory |
| DELETE | `deleteSport` | Delete a sport | ID | Boolean |
| DELETE | `deleteCategory` | Delete a category | ID | Boolean |
| DELETE | `deleteSubcategory` | Delete a subcategory | ID | Boolean |

</details>

<h3 id="cart">🛒 Cart</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `get` | Get the user's cart | | Cart |
| CREATE | `add` | Add a product to the user's cart. Create the cart if necessary | Product Data | Cart |
| UPDATE | `remove` | Remove a product from the user's cart | Product ID | Cart |

</details>

<h3 id="checkout">👜 Checkout</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getOrder` | Get a specific order | Order ID | Order |
| QUERY | `getOrderHistory` | Get all order history for the user | | Order[] |
| CREATE | `createSession` | Using the user's cart, create a Stripe checkout session | Address Data | Checkout Session ID, Order ID |
| UPDATE | `confirmOrder` | After the checkout session is completed, confirm the order and attach the Stripe session ID to it | Checkout Session ID, Order ID | Order |

</details>

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- ADJUSTMENTS -->
<h2 id="adjustments">🔨 Adjusting the Codebase</h2>

  <h3 id="login-providers">🔑 Login Providers</h3>

  By default, we use [Google OAuth](https://console.cloud.google.com) and [Magic Links via Email](https://next-auth.js.org/providers/email), via [NextAuth](https://next-auth.js.org/).  
  If you wish to keep using NextAuth, you can easily add more login providers to your project. You can read more about how to do this [here](https://next-auth.js.org/providers/).  

  However, if you wish to move away from Next Auth, you will have to remove its package and remove *app/api/auth/[...nextauth]* and *server/auth.ts* (or modify them).
  Then, you can implement your own authentication logic. Depending on the needs of your authentication process, you might need to adjust the database schemas.
  Afterwards, you will want to modify the sign in and out buttons, as well as any instances of 'session' in the codebase.
  
  <h3 id="database-options">💾 Database Options</h3>

  By default, we use PostgreSQL via Prisma. If you wish to use a different relational database, the switch should be mostly trivial, having only to adjust the settings in *prisma/schema.prisma*.

  If you wish to use a non-relational database (e.g. MongoDB), Prisma will help make the transition easier, but you will have to tinker the schema. You can read more about it in this [MongoDB article](https://www.mongodb.com/resources/compare/mongodb-postgresql/dsl-migrating-postgres-to-mongodb) and in the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/mongodb-typescript-mongodb).
  <h3 id="image-handling">🖼️ Image Handling</h3>

  By default we use [Supabase Buckets](https://supabase.com/docs/guides/storage) for image handling. If you want to switch to a different method, you can remove the *src/supabase.js* file and adjust the settings in *src/utils/uploadImage.ts*. Furthermore, in *src/utils/uploadChecks.ts* you can modify which types of files and sizes are allowed.

  The implementation of each image hosting method is beyond the scope of this documentation, but easy steps to follow should be provided by the option you choose.

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- ROADMAP -->
<h2 id="roadmap">📍 Roadmap</h2>

- [ ] Improve API structure (e.g. repetition, redundancy)
- [ ] Increase customization options (e.g. custom colors, sizes, etc.)
- [ ] Improve Product management
    - [ ] Product => Size => Color relation inefficiency
    - [ ] Relation to Sales and Orders

See the [open issues](https://github.com/gomisroca/oura/issues) for a full list of proposed features (and known issues).

<p align="right">[<a href="#readme-top">back to top</a>]</p>


<!-- LICENSE -->
<h2 id="license">🔒 License</h2>

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
<h2 id="contact">📧 Contact</h2>

Adrià Gomis - [@gomisroca](https://github.com/gomisroca) - gomisroca@gmail.com


<p align="right">[<a href="#readme-top">back to top</a>]</p>