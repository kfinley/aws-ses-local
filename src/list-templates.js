import path from 'path'
import chalk from 'chalk'
import fs from 'fs'

const listTemplates = (req, res, emailTemplatesDir, log) => {

  let successTemplate = fs.readFileSync(`${__dirname}/templates/list-templates-success.xml`, { encoding: 'utf-8' })
  const itemTemplate = '<Template><Name>{{Name}}</Name><CreatedTimestamp>{{CreatedTimestamp}}</CreatedTimestamp></Template>'

  log(`  ${chalk.green('List 📬 Templates')}`)

  const templates = []

  for (const file of fs.readdirSync(emailTemplatesDir)) {
    let item = itemTemplate.slice()
    const template = JSON.parse(fs.readFileSync(path.join(emailTemplatesDir, file)).toString())
    log(template.TemplateName)
    item = item.replace('{{Name}}', template.TemplateName)
    const { birthtime } = fs.statSync(path.join(emailTemplatesDir, file))
    item = item.replace('{{CreatedTimestamp}}', birthtime)
    templates.push(item)
  }

  if (templates.length > 0) {
    successTemplate = successTemplate.replace('{{Templates}}', templates.join(''))
  }

  res.status(200).send(
    successTemplate
  )
}

export default listTemplates
