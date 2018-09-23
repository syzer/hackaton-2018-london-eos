import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CreatePost extends Component {
  state = {
    title: '',
    content: '',
    tag: '',
    faceIdScanner: 'https://c29d6247.eu.ngrok.io/', // BIT retarded here that is in the state...
    sending: '',
}

  handleOnChange = e =>
    this.setState({ [e.target.name]: e.target.value }) // nice, kudos :)

  createPost = e => {
    e.preventDefault()
    this.props.createPost({ ...this.state, likes: 0 })
    this.setState({
      title: '',
      content: '',
      tag: '',
      image: ''
    })
  }

  handleUploadFaceId = e => {
    e.preventDefault()
    this.setState({ sending: true })

    return fetch(this.state.faceIdScanner, {
      body: new FormData(document.querySelector('#take-face-id')), // non react code,
      method: 'POST',
    })
      .then(resp => resp.json())
      .then(console.warn) // TODO add hidden field here
      .catch(console.error)
  }

  render () {
    return (
      <div className='createContainer padding-30'>
        <div className='controls'>
          <form
            action={this.state.faceIdScanner}
            method="post"
            encType="multipart/form-data"
            id="take-face-id">
            <div className="file-field input-field">
              <div className="btn">
                <span><i className="material-icons right">add</i> a Face Id </span>
                <input type="file" name="file" multiple accept="image/*"/>
              </div>
              <div className="file-path-wrapper" style={{display: 'none'}}>
                <input className="file-path validate" type="text" placeholder="Upload one or more faces"/>
              </div>
            </div>
            <div className="input-field">
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                disabled={this.state.sending}
                onClick={this.handleUploadFaceId}>
                Submit
                <i className="material-icons right">cloud</i>
              </button>
            </div>
          </form>
          {this.state.sending
            ? <div> Icon here => <i className="large material-icons">access_time</i> </div>
            : null}
        </div>

        <div className='card-item padding-30'>
          <input
            className='margin-bottom-15'
            name='title'
            value={this.state.title}
            onChange={this.handleOnChange}
            placeholder='Title'
          />
          <textarea
            className='margin-bottom-15'
            name='content'
            value={this.state.content}
            onChange={this.handleOnChange}
            rows={4}
            placeholder='Phone number'
          />
          <input
            className='margin-bottom-15'
            name='tag'
            value={this.state.tag}
            onChange={this.handleOnChange}
            placeholder='Tag'
          />
          <button
            onClick={this.createPost}
            type='submit'
            className='margin-right-15'
          >Create Post</button>
        </div>
      </div>
    )
  }
}
CreatePost.displayName = 'CreatePost' // Tell React Dev Tools the component name

// Assign Prop Types
CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired
}

export default CreatePost
