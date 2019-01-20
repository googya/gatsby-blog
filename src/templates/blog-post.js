import React from "react"
import Helmet from 'react-helmet'
import { graphql } from "gatsby"
import { DiscussionEmbed } from 'disqus-react'

import BasicLayout from "../layouts/BasicLayout"

import '../styles/main.scss'
import styles from './blog-post.module.scss'

export default ({ data }) => {
  const post = data.markdownRemark
  const disqusShortname = 'inicely'
  const disqusConfig = {
	identifier: post.id,
    title: post.frontmatter.title,
  }

  return (
    <BasicLayout>
      <Helmet>
        <title>{post.frontmatter.title}</title>
      </Helmet>
      <div className={styles.post_head}>
        <h1>{post.frontmatter.title}</h1>
        <span>{post.frontmatter.date}</span>
      </div>
      <hr/>
      <div dangerouslySetInnerHTML={{__html: post.html}}/>
      <hr/>

      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </BasicLayout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
	  id
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
	  fields {
		slug
	  }
    }
  }
`
