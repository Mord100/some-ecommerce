import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productAction } from "../Redux/Actions/Product";
import { addToCartAction } from "../Redux/Actions/Cart";
import {
  FiMinus,
  FiPlus,
  FiHeart,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";
import { BsFileEarmarkText } from "react-icons/bs";
import TestDriveModal from "../components/TestDriveModal";
import ContractPurchaseModal from "../components/ContractPurchaseModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RelatedProducts from "../components/RelatedProducts";
import Layout from "../Layouts/Layouts";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TbProgress } from "react-icons/tb";


function ProductDetail() {
  const { id } = useParams(); // Get the product ID from the URL
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.productReducer);
  const { loading, error, product } = productReducer;

  const [qty, setQty] = useState(1);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showContractPurchaseModal, setShowContractPurchaseModal] =
    useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    dispatch(productAction(id)); // Fetch product details using the ID
  }, [dispatch, id]);

  const addToCartHandler = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Retrieve and parse user info from local storage
    if (!userInfo) {
      toast.error("Please login to add items to cart.");
      window.location.href = "/login";
      return;
    }
    
    const userId = userInfo._id; // Get the user ID from the parsed user info
    
    // Check if the quantity is valid
    if (qty < 1 || qty > product.countInStock) {
      toast.error("Invalid quantity.");
      return;
    }
  
    dispatch(addToCartAction(userId, id, qty)); // Pass user ID, product ID, and quantity
    toast.success("Item added to cart successfully!");
  };

  const openTestDriveModal = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to request a test drive.");
      window.location.href = "/login";
      return;
    }
    setShowTestDriveModal(true);
  };
  const closeTestDriveModal = () => setShowTestDriveModal(false);
  const openContractPurchaseModal = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to initiate contract purchase.");
      window.location.href = "/login";
      return;
    }
    setShowContractPurchaseModal(true);
  };
  const closeContractPurchaseModal = () => setShowContractPurchaseModal(false);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <TbProgress size={40} className="animate-spin mr-3 text-[#f24c1c]" />
          <span className="text-xl font-semibold text-gray-700">
            Loading...
          </span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!product || !product.image || product.image.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-xl">No product data available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 max-w-7xl"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            className="lg:w-3/5"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={product.image[currentImageIndex] || 'fallback-image-url.jpg'}
                alt={product.name}
                className="w-full h-[550px] object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#f24c1c] p-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                  disabled={currentImageIndex === 0}
                  className="text-white"
                >
                  <MdKeyboardArrowLeft className="w-6 h-6" />
                </button>
                <span className="text-white">
                  {currentImageIndex + 1} of {product.image.length}
                </span>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                  disabled={currentImageIndex === product.image.length - 1}
                  className="text-white"
                >
                  <MdKeyboardArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-2/5 space-y-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 ">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {product.brand} - {product.yearOfMake}
              </p>
            </div>
            <p className="text-xl font-semibold text-[#f24c1c]">
              MWK{" "}
              {product.price
                ? product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "N/A"}
            </p>
            <p className="text-gray-700 text-md leading-relaxed">
              {product.description}
            </p>

            {product.countInStock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-2 w-max">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-200 transition-colors"
                  >
                    <FiMinus className="w-6 h-6" />
                  </button>
                  <span className="font-medium text-2xl w-12 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty(Math.min(product.countInStock, qty + 1))
                    }
                    className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-200 transition-colors"
                  >
                    <FiPlus className="w-6 h-6" />
                  </button>
                </div>
                <button
                  onClick={addToCartHandler}
                  className="w-full py-4 px-6 bg-[#f24c1c] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2 text-xl font-semibold shadow-lg hover:shadow-xl transform"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span>Buy Now</span>
                </button>
                {product.category === "Cars" && (
                  <div className="space-y-4 pt-4">
                    <button
                      onClick={openTestDriveModal}
                      className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-lg font-medium hover:shadow-md"
                    >
                      <IoCarSportOutline className="w-6 h-6" />
                      <span>Request a Test Drive</span>
                    </button>
                    <button
                      onClick={openContractPurchaseModal}
                      className="w-full py-3 px-4 bg-[#00315a] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2 text-lg font-medium shadow-lg hover:shadow-xl"
                    >
                      <BsFileEarmarkText className="w-6 h-6" />
                      <span>Contract Purchase</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500 text-xl font-medium bg-red-100 p-4 rounded-lg">
                Out of Stock
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTestDriveModal && (
          <TestDriveModal
            isOpen={showTestDriveModal}
            onClose={closeTestDriveModal}
          />
        )}

        {showContractPurchaseModal && (
          <ContractPurchaseModal
            isOpen={showContractPurchaseModal}
            onClose={closeContractPurchaseModal}
          />
        )}
      </AnimatePresence>

      <RelatedProducts />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Layout>
  );
}

export default ProductDetail;