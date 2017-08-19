import React from 'react'
import Helmet from 'react-helmet'

import Tags from '../components/Tags'
import ResponsiveImage from '../components/ResponsiveImage'
import PrevNext from '../components/PostPrevNext'

export default function Template({ data, pathContext }) {
  const { markdownRemark: post } = data
  const { next, prev } = pathContext
  return (
    <div>
      <Helmet title={`${post.frontmatter.title} · Some Posts`} />
      <div>
        {data.responsiveImage
          ? <ResponsiveImage imgData={data.responsiveImage.responsiveSizes} />
          : null}
        <h1>
          {post.frontmatter.title}
        </h1>
        <h4 style={{ marginTop: 0 }}>
          {post.frontmatter.date} - {post.timeToRead} minute read
        </h4>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <Tags list={post.frontmatter.tags || []} />
        <PrevNext prev={prev} next={next} />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!, $responsiveImageFilePath: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      timeToRead
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        tags
        title
      }
    }
    responsiveImage: imageSharp(id: { regex: $responsiveImageFilePath }) {
      responsiveSizes {
        aspectRatio
        base64
        src
        srcSet
        sizes
      }
    }
  }
`
