export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-2 text-center text-sm text-gray-500">
      <p>&copy; {new Date().getFullYear()} Medstagram. All rights reserved.</p>
      <p><a href="#" className="text-violet-600 hover:underline">Privacy Policy</a> | <a href="#" className="text-violet-600 hover:underline">Terms of Service</a> | <a href="#" className="text-violet-600 hover:underline">Contact Us</a></p>
    </footer>
  )
} 