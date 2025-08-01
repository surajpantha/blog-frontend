// import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Spinner from "./Spinner"
import { Navigate, useLocation } from "react-router-dom"
import { checkAuthStatus } from "../store/authSlice"
// import api from "@/api"

const ProtectedRoute = ({ children }) => {

    const [isChecking, setIsChecking] = useState(true)
    const dispatch = useDispatch()
    const location = useLocation()


    const { isAuthenticated, loading } = useSelector((state) => state.auth)

    useEffect(() => {
        const checkAuth = async () => {
            await dispatch(checkAuthStatus());
            setIsChecking(false)
        }
        checkAuth()
    }, [dispatch])


    if (isChecking || loading) {
        return <Spinner />
    }

    return isAuthenticated ? children :
        <Navigate to="/login" state={{ from: location }} replace />


}

export default ProtectedRoute
