import request from 'supertest'
import app from '../../config/app'

describe('Body Parser middleware', () => {
  test('should parse body as json', async () => {
    app.post('/test_body_parser', (request, response) => {
      response.send(request.body)
    })

    const object = { name: 'Erick' }

    await request(app)
      .post('/test_body_parser')
      .send(object)
      .expect(object)
  })
})
