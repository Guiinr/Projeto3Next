'use client'

import { useState, useEffect, useMemo } from 'react'
import { FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Image from 'next/image'
import styles from './Shop.module.css'

// Lista de produtos
const PRODUCTS = [
  { id: 1, name: "Produto 1", price: "R$ 99,99", image: "/assets/arte.png", category: "arte-digital" },
  { id: 2, name: "Produto 2", price: "R$ 149,99", image: "/assets/fotografia.jpg", category: "pintura" },
  { id: 3, name: "Produto 3", price: "R$ 199,99", image: "/assets/escultura.jpg", category: "fotografia" },
  // Adicione os outros produtos conforme necessário
]

const PRODUCTS_PER_PAGE = 12

export default function Shop() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [visibleProducts, setVisibleProducts] = useState([])
  const [cartItems, setCartItems] = useState([])

  const filteredProducts = useMemo(() => {
    return selectedCategory === "todos"
      ? PRODUCTS
      : PRODUCTS.filter(product => product.category === selectedCategory)
  }, [selectedCategory])

  useEffect(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    const end = start + PRODUCTS_PER_PAGE
    const productsToShow = filteredProducts.slice(start, end)

    setVisibleProducts([])
    const timer = setTimeout(() => {
      setVisibleProducts(productsToShow)
    }, 100)

    return () => clearTimeout(timer)
  }, [currentPage, filteredProducts])

  const handleNextPage = () => setCurrentPage(prev => prev + 1)
  const handlePrevPage = () => setCurrentPage(prev => prev - 1)
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setCurrentPage(1)
  }

  const handleAddToCart = (productId: number) => {
    setCartItems(prev => [...prev, productId])
  }

  const hasNextPage = (currentPage * PRODUCTS_PER_PAGE) < filteredProducts.length

  return (
    <main className={styles.shop}>
      <div className={styles.shopHeader}>
        <h1 className={styles.shopTitle}>Nossa Galeria</h1>
        <p className={styles.shopSubtitle}>Descubra obras exclusivas para seu espaço</p>
        
        <div className={styles.filterContainer}>
          <select 
            className={styles.filterSelect} 
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="todos">Todas Categorias</option>
            <option value="arte-digital">Arte Digital</option>
            <option value="pintura">Pintura</option>
            <option value="fotografia">Fotografia</option>
            <option value="escultura">Escultura</option>
          </select>
        </div>
      </div>

      <div className={styles.productsGrid}>
        {visibleProducts.map((product, index) => {
          const itemCount = cartItems.filter(id => id === product.id).length
          return (
            <div 
              key={product.id} 
              className={`${styles.productCard} ${styles.visible}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={styles.productImageContainer}>
                <Image 
                  src={product.image} 
                  alt={product.name}
                  width={250}
                  height={250}
                  className={styles.productImage}
                />
                <button 
                  className={styles.addToCartBtn}
                  onClick={() => handleAddToCart(product.id)}
                  aria-label="Adicionar ao carrinho"
                >
                  <FaShoppingCart className={styles.cartIcon} />
                  {itemCount > 0 && (
                    <span className={styles.cartBadge}>{itemCount}</span>
                  )}
                </button>
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <span className={styles.productPrice}>{product.price}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.pagination}>
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={styles.paginationBtn}
        >
          <FaChevronLeft /> Anterior
        </button>
        <span className={styles.pageNumber}>Página {currentPage}</span>
        <button 
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className={styles.paginationBtn}
        >
          Próxima <FaChevronRight />
        </button>
      </div>
    </main>
  )
}