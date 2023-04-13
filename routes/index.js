var express = require('express');
var router = express.Router();
const fs = require('fs');
var demo_model = require('../db/model/demo');
var config = require('../config');

router.get('/', function (req, res, next) {
  let user = null;
  let demo_license_info = new demo_model();

  res.render('index', {
    page: 'Gestión de accesos, tiempos y velocidad de internet',
    menuId: 'home',
    user: user,
    demo_license: demo_license_info,
    version: config.version,
    faqPage: false
  });
});

router.get('/index', function (req, res, next) {
  let user = null;
  let demo_license_info = new demo_model();
  res.render('index', {
    page: 'Gestión de accesos, tiempos y velocidad de internet',
    menuId: 'home',
    user: user,
    demo_license: demo_license_info,
    version: config.version,
    faqPage: false
  });
});

router.get('/inicio', function (req, res, next) {
  let user = null;
  let demo_license_info = new demo_model();
  res.render('index', {
    page: 'Gestión de accesos, tiempos y velocidad de internet',
    menuId: 'home',
    user: user,
    demo_license: demo_license_info,
    version: config.version,
    faqPage: false
  });
});

router.get('/cuenta', function (req, res, next) {
  let user = null;
  res.render('account', {
    page: 'Cuenta de usuario',
    menuId: 'account',
    user: user,
    version: config.version,
    faqPage: true
  });
});

router.get('/acerca', function (req, res, next) {

  let user = null;
  res.render('about', {
    page: 'Acerca de nosotros',
    menuId: 'about',
    user: user,
    version: config.version,
    faqPage: true
  });
});

router.get('/faq', function (req, res, next) {
  let user = null;
  res.render('faq', {
    page: 'Centro de Ayuda',
    menuId: 'faq',
    user: user,
    version: config.version,
    faqPage: true
  });
});

router.get('/ayuda', function (req, res, next) {
  let user = null;
  res.render('faq', {
    page: 'Centro de Ayuda',
    menuId: 'faq',
    user: user,
    version: config.version,
    faqPage: true
  });
});

router.get('/blog', function (req, res, next) {
  let user = null;
  res.render('blog', {
    page: 'Blog',
    menuId: 'blog',
    user: user,
    version: config.version,
    faqPage: true
  });
});

router.get('/terminos', function (req, res, next) {

  let user = null;
  res.render('terminos', {
    page: 'Terminos y condiciones de uso',
    menuId: 'terminos_uso',
    user: user,
    version: config.version,
    faqPage: true
  });
});

module.exports = router;