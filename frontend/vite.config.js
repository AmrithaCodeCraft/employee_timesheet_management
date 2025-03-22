/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// // https://vitejs.dev/config/
// export default defineConfig({
//  plugins: [react()],
//  resolve: {
//    alias: {
//      "@": path.resolve(__dirname, "./src"),
//    },
//  },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // ✅ Ensure alias is correct
    },
  },
});
