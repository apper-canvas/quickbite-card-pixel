import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './components/templates/MainLayout'
import RestaurantsPage from './pages/RestaurantsPage'
import MenuPage from './pages/MenuPage'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<RestaurantsPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/menu/:restaurantId" element={<MenuPage />} />
            <Route path="/orders" element={<PlaceholderPage featureName="Orders" />} />
            <Route path="/favorites" element={<PlaceholderPage featureName="Favorites" />} />
            <Route path="/promotions" element={<PlaceholderPage featureName="Promotions" />} />
            <Route path="/account" element={<PlaceholderPage featureName="Account" />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  )
}

export default App