'use client'

import Swal from "sweetalert2";
import { LogoutIcon, HomeIcon, ClipboardListIcon } from '@heroicons/react/outline';
import { signOut } from "next-auth/react";


export default function Logout() {
    const handleLogout = () => {
        // alert("Logging out..."); // เพิ่มการดำเนินการเมื่อ logout เช่น redirect หรือ clear session
        // signOut({ callbackUrl: "/login" });
    
        Swal.fire({
          title: 'Are you sure?',
          text: 'You are about to log out!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#7066e0',
          cancelButtonColor: '#545454',
          confirmButtonText: 'Yes, log out!',
        }).then((result) => {
          if (result.isConfirmed) {
            // Proceed with logout action
            // Add your logout logic here
            console.log('Logging out...');
            signOut({ callbackUrl: "/" });
            // For example: redirect to login page or clear user data
          }
        });
      };
    return (
        <div className="flex items-center">
            {/* <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" /> */}
            <span>Log out</span>
            <button
              onClick={handleLogout}
              className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <LogoutIcon className="w-5 h-5" href="/" />
            </button>
          </div>
    );
}