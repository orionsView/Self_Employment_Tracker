import type { set } from 'lodash';
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function SetPageTitle() {
    const location = useLocation();

    useEffect(() => {
        let pageTitle = "Punch The Clock";

        const pathMap: { [key: string]: string } = {
            "/login": "Login",
            "/signup": "Sign Up",
            "/settings": "Settings",
            "/menu": "Menu",
            "/logged/search": "Search Jobs",
            "/logged/view": "View Jobs",
            "/log": "Log New Job",
            "/trends": "Trends"
        };

        const currentPage = pathMap[location.pathname];
        if (currentPage) {
            document.title = `${pageTitle} | ${currentPage}`;
        } else {
            document.title = pageTitle;
        }
    }, [location]);
}

export default SetPageTitle;