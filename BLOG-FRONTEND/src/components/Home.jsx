import React from 'react'
import {
  pageWrapper,
  pageBackground,   
  pageTitleClass,
  headingClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  timestampClass,
  tagClass,
  section,
  divider,
  inputClass,
  
} from '../styles/common.js'

const features = [
  {
    title: "Write & Publish",
    desc: "Create structured articles with categories and rich content flow."
  },
  {
    title: "Edit Anytime",
    desc: "Update content seamlessly with smooth author control."
  },
  {
    title: "Minimal Reading",
    desc: "Distraction-free typography focused reading experience."
  },
  {
    title: "Organised Categories",
    desc: "Explore articles grouped meaningfully for faster discovery."
  },
  {
    title: "Fast Navigation",
    desc: "Instant routing and state-based loading for fluid UX."
  },
  {
    title: "Secure Access",
    desc: "Role-based authentication and protected workflows."
  }
]

function Home() {
  return (
    <div className={`${pageWrapper} ${pageBackground}`}>
      
      {/* Hero Section */}
      <section className={section}>
        <h1 className={pageTitleClass}>
          Welcome to <span className="text-[#0066cc]">BlogHub</span>
        </h1>
        <p className={`${bodyText} max-w-2xl mb-8`}>
          Discover insightful articles on web development, React, Node.js, and modern frontend technologies. 
          Join thousands of developers learning and growing together.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a href="/register" className={primaryBtn}>Start Reading</a>
          <a href="/login" className={secondaryBtn}>Have Account?</a>
        </div>
      </section>

      <div className={divider} />

      {/* Featured Articles */}
      <section className={section}>

  <h2 className={headingClass}>What you can do</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

    {features.map((f,i)=>(
      <div key={i} className={`${articleCardClass} rounded-2xl hover:-translate-y-1 transition-all`}>
        <h3 className={articleTitle}>{f.title}</h3>
        <p className={articleExcerpt}>{f.desc}</p>
      </div>
    ))}

  </div>

</section>

      {/* Newsletter CTA */}
      <section className={`${section} text-center bg-[#f5f5f7] rounded-3xl p-12`}>
        <h2 className={`${headingClass} mb-4`}>Stay Updated</h2>
        <p className={`${bodyText} mb-8 max-w-lg mx-auto`}>
          Get the latest articles delivered to your inbox weekly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            className={`${inputClass} flex-1`}
          />
          <button className={primaryBtn}>Subscribe</button>
        </div>
      </section>

    </div>
  )
}

export default Home
