import { useState, useEffect } from "react"
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from "axios"
import { motion, AnimatePresence } from "motion/react"
import "./App.css"

function App() {
  const [code, setCode] = useState("")
  const [review, setReview] = useState("")
  const [isReviewing, setIsReviewing] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setIsReviewing(true)
    try {
      const response = await axios.post(`${BASE_URL}/ai/get-review`, { code })
      setReview(response.data)
      if (window.innerWidth < 768) {
        setActiveTab("review")
      }
    } catch (error) {
      setReview("Error getting review. Please try again.")
    } finally {
      setIsReviewing(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <motion.div className="app-container" initial="hidden" animate="visible" variants={containerVariants}>
      <header className="app-header">
        <motion.div className="logo" variants={itemVariants} whileHover={{ scale: 1.05 }}>
          <span className="logo-text">
            Code<span className="accent">Review</span>
          </span>
        </motion.div>

        <motion.div className="header-actions" variants={itemVariants}>
          <motion.button className="theme-toggle" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </motion.button>

          <motion.button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </motion.button>
        </motion.div>
      </header>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-tabs">
              <motion.button
                className={`tab-button ${activeTab === "editor" ? "active" : ""}`}
                onClick={() => setActiveTab("editor")}
                whileHover={{ backgroundColor: "#2a2a2a" }}
                whileTap={{ scale: 0.95 }}
              >
                Editor
              </motion.button>
              <motion.button
                className={`tab-button ${activeTab === "review" ? "active" : ""}`}
                onClick={() => setActiveTab("review")}
                whileHover={{ backgroundColor: "#2a2a2a" }}
                whileTap={{ scale: 0.95 }}
              >
                Review
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main className="content-area" variants={itemVariants}>
        <motion.div
          className={`panel editor-panel ${activeTab === "editor" ? "active" : ""}`}
          initial={false}
          animate={{
            x: activeTab === "editor" || window.innerWidth >= 768 ? 0 : "-100%",
            opacity: activeTab === "editor" || window.innerWidth >= 768 ? 1 : 0.3,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="panel-header">
            <h2>Code Editor</h2>
            <div className="file-info">
              <span className="file-name">main.js</span>
              <span className="file-type">JavaScript</span>
            </div>
          </div>

          <div className="editor-container">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                backgroundColor: "transparent",
                color: "#fff",
                height: "100%",
                width: "100%",
                borderRadius: "8px",
              }}
              placeholder="// Write your code here..."
            />
          </div>

          <motion.div
            className="panel-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="review-button"
              onClick={reviewCode}
              disabled={isReviewing || !code.trim()}
              whileHover={{ scale: 1.03, backgroundColor: "#6366f1" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {isReviewing ? (
                <div className="loading-spinner">
                  <svg className="spinner" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                  <span>Reviewing...</span>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>Review Code</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className={`panel review-panel ${activeTab === "review" ? "active" : ""}`}
          initial={false}
          animate={{
            x: activeTab === "review" || window.innerWidth >= 768 ? 0 : "100%",
            opacity: activeTab === "review" || window.innerWidth >= 768 ? 1 : 0.3,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="panel-header">
            <h2>Code Review</h2>
            {review && (
              <motion.div
                className="review-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.1, backgroundColor: "#2a2a2a" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                </motion.button>
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.1, backgroundColor: "#2a2a2a" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </div>

          <div className="review-content">
            {review ? (
              <motion.div
                className="markdown-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
              </motion.div>
            ) : (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <h3>No review yet</h3>
                <p>Write some code and click the "Review Code" button to get feedback</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.main>

      <motion.footer className="app-footer" variants={itemVariants}>
        <p>© {new Date().getFullYear()} CodeReview • AI-Powered Code Analysis</p>
      </motion.footer>
    </motion.div>
  )
}

export default App
