const ProductModel = require('../models/product')
const { checkIfAdmin, sanitizeRequestBody } = require('../utilities/middleware')

class StoreRoutes {

  constructor(server, app) {

    this.app = app
    this.server = server

    this.registerRoutes()
  }


  registerRoutes() {

    // Views
    this.server.get('/store', this.checkIfStoreEnabled, this.renderPage.bind(this, ''))
    this.server.get('/store/new', this.checkIfStoreEnabled, checkIfAdmin, this.renderPage.bind(this, '_create'))
    this.server.get('/store/checkout', this.checkIfStoreEnabled, this.renderPage.bind(this, '_checkout'))
    this.server.get('/store/:id', this.checkIfStoreEnabled, this.renderPage.bind(this, '_show'))
    this.server.get('/store/:id/edit', this.checkIfStoreEnabled, checkIfAdmin, this.renderPage.bind(this, '_edit'))

    // Store API
    this.server.post('/api/products', checkIfAdmin, sanitizeRequestBody, this.createProduct.bind(this))
    this.server.get('/api/products', this.sendAllProducts.bind(this))
    this.server.get('/api/published_products', this.sendPublishedProducts.bind(this))
    this.server.get('/api/products/:id', this.sendOneProduct.bind(this))
    this.server.put('/api/products/:id', checkIfAdmin, sanitizeRequestBody, this.updateProduct.bind(this))
    this.server.delete('/api/products/:id', checkIfAdmin, this.deleteProduct.bind(this))
  }


  checkIfStoreEnabled(req, res, next) {

    const { settings } = res.locals

    if (settings && settings.enableStore) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  renderPage(pageExtension, req, res) {

    const actualPage = `/store${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id }

    this.app.render(req, res, actualPage, queryParams)
  }


  createProduct(req, res) {

    const product = new ProductModel(req.body)

    product.save()
    res.send(product)
  }


  async sendAllProducts(req, res) {

    const foundProducts = await ProductModel.find().sort({ created: -1 })

    res.send(foundProducts)
  }


  async sendPublishedProducts(req, res) {

    const foundProducts = await ProductModel.find({ published: true }).sort({ created: -1 })

    res.send(foundProducts)
  }


  async sendOneProduct(req, res) {

    const foundProduct = await ProductModel.findById(req.params.id)
      .populate('author')
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })

    res.send(foundProduct)
  }


  async updateProduct(req, res) {

    const productDocument = { _id: req.params.id }
    const updatedProduct = await ProductModel.findOneAndUpdate(productDocument, req.body)

    res.send(updatedProduct)
  }


  async deleteProduct(req, res) {

    const product = await ProductModel.findById(req.params.id)

    await ProductModel.findByIdAndDelete(req.params.id)

    res.send('product deleted')
  }
}

module.exports = StoreRoutes
