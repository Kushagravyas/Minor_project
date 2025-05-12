import { useState,useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState('')

const [review, setReview] = useState(``)

const BASE_URL=import.meta.env.VITE_API_URL;

  useEffect (() => {
    prism.highlightAll();
  }, [])

  async function reviewCode() {
  const response = await axios.post(`${BASE_URL}/ai/get-review`, { code })
  
    setReview(response.data)

  }

  return (
    <> 
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 18,
              backgroundColor: "#282c34",
              color: "#fff",
              height: "100%",
              width: "100%",

            }}
          />
        </div>
          <div 
          onClick={reviewCode}
          className="review">Review</div>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
      </main> 
    </>
  )
}

export default App


