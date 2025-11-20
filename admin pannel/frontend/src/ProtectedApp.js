function ProtectedApp({ user, logout }) {
    const navigate = useNavigate();
    const doLogout = () => { logout(); navigate('/login'); }


    return (
        <div className="app">
            <Sidebar onLogout={doLogout} />
            <div className="content">
                <Topbar user={user} />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="*" element={<div className="card">Not found</div>} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}