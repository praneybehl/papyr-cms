import React from 'react'
import { connect } from 'react-redux'
import PostsFilter from '../components/PostsFilter'
import {
  SectionCards,
  SectionMedia,
  SectionStandard,
} from '../components/Sections/'


const LandingPage = props => (
  <div className="landing">
    <PostsFilter
      component={SectionCards}
      posts={props.posts}
      settings={{
        maxPosts: 3,
        postTags: ['portfolio', 'web']
      }}
      componentProps={{
        title: 'Past work',
        contentLength: 150,
        readMore: true,
        perRow: 3
      }}
    />

    <PostsFilter
      component={SectionMedia}
      posts={props.posts}
      singular
      settings={{
        postTags: 'parallax',
        maxPosts: 1
      }}
      componentProps={{
        fixed: true,
        alt: 'code',
        emptyTitle: 'This is the parallax section',
        emptyMessage: 'Create content with the "parallax" tag.'
      }}
    />

    <PostsFilter
      component={SectionStandard}
      posts={props.posts}
      settings={{
        postTags: 'services',
        maxPosts: 2,
      }}
      componentProps={{
        title: 'What can I do for you?',
        contentLength: 300,
        readMore: true,
      }}
    />
    
  </div>
)


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(LandingPage)
