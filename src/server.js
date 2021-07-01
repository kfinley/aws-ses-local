#!/usr/bin/env node

// Import node libs
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
// Import local libs
import mkdir from './library/mkdir'
import options from './library/options'
import rmdir from './library/rmdir'

import sendEmail from './send-email'
import sendRawEmail from './send-raw-email'
import listTemplates from './list-templates'
import createTemplate from './create-template'
import getTemplate from './get-template'
import deleteTemplate from './delete-template'
import sendTemplatedEmail from './send-templated-email'

const app = express()
const log = console.log //eslint-disable-line

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const errorTemplate = fs.readFileSync(`${__dirname}/templates/error.xml`, { encoding: 'utf-8' })
const sendingEnabledTemplate = fs.readFileSync(`${__dirname}/templates/sending-enabled.xml`, { encoding: 'utf-8' })

log(`
${chalk.inverse('  AWS Simple Email Service Local 📪   ')}
  ${chalk.green('Listening on port:')} ${options.port}`)

if (options.clean !== undefined) {
  log(`  ${chalk.red('Cleaning directory:')} ${options.outputDir}`)
  rmdir(options.outputDir)
}

log(`  ${chalk.green('Creating output directory:')} ${options.outputDir}`)
mkdir(path.join(options.outputDir))

const emailTemplatesDir = path.join('./email-templates');

log(`  ${chalk.green('Creating emaail templates directory:')} './email-templates'`)
mkdir(emailTemplatesDir)

app.post('/', (req, res) => {
  const dateTime = new Date().toISOString()
  const dateDir = `${options.outputDir}/${dateTime.slice(0, 10)}`
  const fullDir = `${dateDir}/${dateTime.slice(11, 22).replace(/:\s*/g, '.')}`

  try {
    switch (req.body.Action) {
      case 'SendEmail':
        sendEmail(req, res, dateDir, fullDir, log)
        break
      case 'SendRawEmail':
        sendRawEmail(req, res, dateDir, fullDir, log)
        break
      case 'GetAccountSendingEnabled':
        log(`  ${chalk.green('GetAccountSendingEnabled request received')}`)
        res.status(200).send(sendingEnabledTemplate)
        break
      case 'ListTemplates':
        listTemplates(req, res, emailTemplatesDir, log)
        break
      case 'CreateTemplate':
        createTemplate(req, res, emailTemplatesDir, log)
        break
      case 'GetTemplate':
        getTemplate(req, res, emailTemplatesDir, log)
        break
      case 'DeleteTemplate':
        deleteTemplate(req, res, emailTemplatesDir, log)
        break
      case 'SendTemplatedEmail':
        sendTemplatedEmail(req, res, dateDir, fullDir, emailTemplatesDir, log)
        break
      default:
        log(req)
        throw new Error(`Unsupported action ${req.body.Action}`)

    }
  } catch (err) {
    log(`   ${chalk.red('Error Occured:')} ${err}`)
    res.status(500).send(
      errorTemplate.replace('{{code}}', 'MessageRejected').replace('{{message}}', err.message)
    )
  }
})

app.listen(options.port)

export default app
