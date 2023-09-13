import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { bugService } from './services/bug.service.js'
const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json()) // for req.body

// List
app.get('/api/bug', (req, res) => {
  const { title, minSeverity, pageIdx, labels, type, desc } = req.query
  const filterBy = { title, minSeverity, labels, pageIdx }
  const sortBy = { type, desc }
  bugService.query(filterBy, sortBy).then((data) => {
    res.send(data)
  })
})

app.get('/nono', (req, res) => {
  res.redirect('/')
})

// Add
app.post('/api/bug/save', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const { title, severity, description, createdAt, labels } = req.body
  const bug = {
    title,
    severity: +severity,
    description,
    createdAt,
    labels,
  }
  bugService
    .save(bug, loggedinUser)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug')
    })
})

// Edit / Update
app.put('/api/bug/save', (req, res) => {
  console.log('puki here')
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  console.log('loggedinUser:', loggedinUser)
  if (!loggedinUser) return res.status(401).send('Cannot update bug')
  console.log('req.body:', req.body)
  const { _id, title, severity, description, createdAt, labels } = req.body
  const bug = {
    _id,
    title,
    severity: +severity,
    description,
    createdAt,
    labels,
  }
  bugService
    .save(bug, loggedinUser)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot save car', err)
      res.status(400).send('Cannot save car')
    })
})
// Read - getById
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  bugService
    .get(bugId)
    .then((bug) => {
      let visitedBugsIds = req.cookies.visitedBugsIds || []
      const bugExist = visitedBugsIds.find((id) => id === bugId)
      if (!bugExist) {
        if (visitedBugsIds.length < 3) {
          visitedBugsIds.push(bugId)
        } else return res.status(401).send('Wait for a bit')
      }
      res.cookie('visitedBugsIds', visitedBugsIds, { maxAge: 1000 * 7 })
      res.send(bug)
    })
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug')
    })
})

// Remove
app.delete('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot delete bug')

  const { bugId } = req.params
  bugService
    .remove(bugId, loggedinUser)
    .then((msg) => {
      res.send('Bug removed successfully')
    })
    .catch((err) => {
      loggerService.error('Cannot remove car', err)
      res.status(400).send('Cannot remove car')
    })
})

// Get Users (READ)
app.get('/api/user', (req, res) => {
  userService
    .query()
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      loggerService.error('Cannot get users', err)
      res.status(400).send('Cannot get users')
    })
})

// Get User (READ)
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params

  userService
    .getById(userId)
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      loggerService.error('Cannot get user', err)
      res.status(400).send('Cannot get user')
    })
})

app.post('/api/auth/login', (req, res) => {
  const credentials = req.body
  userService.checkLogin(credentials).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      res.status(401).send('Invalid Credentials')
    }
  })
})

app.post('/api/auth/signup', (req, res) => {
  const credentials = req.body
  userService
    .add(credentials)
    .then((user) => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch((err) => {
      loggerService.error('Cannot signup', err)
      res.status(400).send('Cannot signup')
    })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Loggedout..')
})

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
