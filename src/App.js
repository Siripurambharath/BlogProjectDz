import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginform from "./Blogfolder/Loginform";
import Register from "./Blogfolder/Register";
import Navbar from "./Blogfolder/Navbar";
import Writetext from "./Blogfolder/Writetext";
import Home from "./Blogfolder/Home";
import Settings from "./Blogfolder/Settings";
import Blogs from "./Blogfolder/Blogs";
import Notifications from "./Blogfolder/Notifications";
import Edit from "./Blogfolder/Edit";
import Profile from "./Blogfolder/Profile";
import BlogDetail from "./Blogfolder/BlogDetail";
import Navbar2 from "./Blogfolder/Navbar2";
import Dashboard from "./Blogfolder/Dashboard";
import Categories from "./Blogfolder/Categories";
import Posts from "./Blogfolder/Posts";
import SingleBlog from './Blogfolder/SingleBlog';
import Subcategorypage from "./Blogfolder/Subcategorypage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Loginform />} />
        <Route path="/register" element={<Register />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/writetext" element={<Writetext />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:categoryName" element={<Home />} /> 
        <Route path="/subcategory/:subcategoryName" element={<Subcategorypage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/navbar2" element={<Navbar2 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
<Route path="/posts" element={<Posts />} />
<Route path="/single-blog/:id" element={<SingleBlog />} />
      </Routes>
    </Router>
  );
};

export default App;
