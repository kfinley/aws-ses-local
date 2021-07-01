import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import mkdir from './library/mkdir'

const sendTemplatedEmail = (req, res, dateDir, fullDir, emailTemplatesDir, log) => {

  const successTemplate = fs.readFileSync(`${__dirname}/templates/send-templated-email-success.xml`, { encoding: 'utf-8' })

  log(`  ${chalk.green('Send Templated 📬')}`)

  const templatePath = path.join(emailTemplatesDir, `${req.body.Template}Template.json`)
  const templateData = JSON.parse(req.body.TemplateData)

  const template = JSON.parse(fs.readFileSync(templatePath).toString())

  let html = template.HtmlPart
  let text = template.TextPart

  for (const key in templateData) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), templateData[key])
    text = text.replace(new RegExp(`{{${key}}}`, 'g'), templateData[key])
  }

  if (!(req.body.Source && template.SubjectPart && (template.HtmlPart || template.HtmlPart) && req.body['Destination.ToAddresses.member.1'])) {
    throw new Error('One or more required fields was not sent')
  }
  const headers = `Subject: ${template.SubjectPart}\nTo Address: ${req.body['Destination.ToAddresses.member.1']}\nCc Address: ${req.body['Destination.CcAddresses.member.1']}\nBcc Address: ${req.body['Destination.BccAddresses.member.1']}\nReply To Address: ${req.body['ReplyToAddresses.member.1']}\nSource: ${req.body.Source}`

  mkdir(path.join(dateDir))
  mkdir(path.join(fullDir))
  log(`  📬  ${chalk.green('Email Received')}
    ${chalk.blue('From:')} ${req.body.Source}
    ${chalk.blue('To:')} ${req.body['Destination.ToAddresses.member.1']}
    ${chalk.blue('Subject:')} ${template.SubjectPart}
    ${chalk.blue('Html Email:')} ${process.cwd()}/${path.join(fullDir)}/body.html
    ${chalk.blue('Text Email:')} ${process.cwd()}/${path.join(fullDir)}/body.txt
  `)
  fs.writeFileSync(`${fullDir}/body.html`, html)
  fs.writeFileSync(`${fullDir}/body.txt`, text)
  fs.writeFileSync(`${fullDir}/headers.txt`, headers)

  res.status(200).send(
    successTemplate.replace('{{MessageId}}', `${process.cwd()}/${path.join(fullDir)}/body.html`)
  )
}

export default sendTemplatedEmail
