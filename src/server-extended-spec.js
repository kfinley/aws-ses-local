import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import xmldoc from 'xmldoc'
import fs from 'fs'
import server from './server'

chai.use(chaiHttp)

const toAddress = 'to@email.com'
const fromEmail = 'from@email.com'

describe('/POST ListTemplates', () => {
  it('should return enabled set to true', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'ListTemplates',
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        const response = new xmldoc.XmlDocument(res.text)
        const enabled = response.valueWithPath('GetAccountSendingEnabledResult.Enabled')
        expect(enabled).to.equal('true')
        done()
      })
  })
})
