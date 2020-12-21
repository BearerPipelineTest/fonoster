import Verb from './verb'
import logger from '@fonos/logger'

interface PlayOptions {
  finishOnKey?: string
}

const validate = (file: string, options: PlayOptions) => {
  const { finishOnKey = '#' } = options
  if (!file) throw 'you must indicate a file.'
  if (
    finishOnKey &&
    (finishOnKey.length !== 1 || '1234567890#*'.indexOf(finishOnKey) < 0)
  )
    throw `Invalid finishOnKey parameter: found ${finishOnKey} but must be a single digit type of 0-9,#,*`
}

class Play extends Verb {
  constructor (channel: any, config: any) {
    super(channel, config)
  }

  run (file: string, options: PlayOptions = {}) {
    const { finishOnKey = '#' } = options
    validate(file, options)
    logger.log('debug', '@fonos/voice.Play [sending file to AGI Server]')
    const result = this.channel.streamFile(file, finishOnKey)
    logger.log(
      'debug',
      `@fonos/voice.Play [rawReply from AGI '${result.rawReply}'`
    )

    if (result.code === 200) return result.attributes.result

    throw result.rawReply
  }
}

export { Play as default, PlayOptions }
