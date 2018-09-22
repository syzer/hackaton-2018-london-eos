const { AbstractActionHandler } = require('demux')
const mongoose = require('mongoose')
const Post = require('../api/post/post.model')
const BlockIndexState = require('../api/block-index-state/block-index-state.model')
const io = require('../utils/io')

class ActionHandler extends AbstractActionHandler {
  constructor (updaters, effects, uri) {
    mongoose.connect(uri)

    // CONNECTION EVENTS
    // Connection successful
    mongoose.connection.on('connected', () => {
      console.info(`Mongoose default connection open to ${uri}`)
    })

    // Connection throws an error
    mongoose.connection.on('error', console.error.bind(console, 'Mongoose default connection error:'))

    // Connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.info('Mongoose default connection disconnected')
    })

    // Close the connection if the node process is terminated
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.info('Mongoose default connection disconnected through app termination')
        process.exit(0)
      })
    })
    super(updaters, effects)
  }

  async handleWithState (handle) {
    const context = { socket: io.getSocket() }
    const state = { post: Post, blockIndexState: BlockIndexState }
    try {
      await handle(state, context)
    } catch (err) {
      console.error(err)
    }
  }

  async updateIndexState (state, block, isReplay) {
    const { blockInfo } = block
    try {
      await state.blockIndexState.update({}, {
        blockNumber: blockInfo.blockNumber,
        blockHash: blockInfo.blockHash,
        isReplay
      }, { upsert: true }).exec()
    } catch (err) {
      console.error(err)
    }
  }

  async loadIndexState () {
    try {
      let blockHash
      let blockNumber
      const indexState = await BlockIndexState.findOne({}).exec()
      if (indexState) {
        ({ blockHash, blockNumber } = indexState)
      }
      if (blockNumber && blockHash) {
        return { blockNumber, blockHash }
      }
      return { blockNumber: 0, blockHash: '' }
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = ActionHandler
