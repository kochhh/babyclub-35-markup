'use strict'

import { src, dest, watch, series, parallel } from 'gulp'

// dev
import server from 'browser-sync'
import del from 'del'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'
import wait from 'gulp-wait'
import rename from 'gulp-rename'

// html
import pug from 'gulp-pug'

// css
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import gcmq from 'gulp-group-css-media-queries'

// js
import terser from 'gulp-terser'
import rollup from 'gulp-better-rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

const source = ((base) => ({
  pug:    `${base}/pug`,
  css:    `${base}/static/sass`,
  js:     `${base}/static/js`,
  img:    `${base}/static/img`,
  fonts:  `${base}/static/fonts`,
  email:  `${base}/email`
}))('src')

const build = ((base) => ({
  root:   `${base}`,
  css:    `${base}/static/css`,
  js:     `${base}/static/js`,
  img:    `${base}/static/i`,
  fonts:  `${base}/static/fonts`,
  email:  `${base}/email`
}))('dist')

const Server = server.create()

const errorHandler = function() {
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
    sound: 'Submarine'
  }).apply(this, [...arguments])
  this.emit('end')
}

export const clean = () => del([`${build.root}/`])

export function serverInit() {
  Server.init({
    server: {
      baseDir: `${build.root}/`
    },
    port: 8080,
    logLevel: 'info',
    logConnections: false,
    logFileChanges: true,
    open: false,
    ui: false,
    notify: false,
    ghostMode: false,
    reloadDelay: 500
  })
}

export function html() {
  return src(`${source.pug}/pages/*.pug`)
    .pipe(pug({ pretty: true }))
    .pipe(plumber({ errorHandler }))
    .pipe(Server.stream({ once: true }))
    .pipe(dest(`${build.root}/`))
}

export function stylesDev() {
  return src(`${source.css}/app.scss`)
    .pipe(plumber({ errorHandler }))
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 4
    }))
    .pipe(sourcemaps.write())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename({ basename: 'main' }))
    .pipe(dest(`${build.css}/`))
    .pipe(Server.stream())
}

export function stylesBuild() {
  return src(`${source.css}/app.scss`)
    .pipe(plumber({ errorHandler }))
    .pipe(wait(500))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 4
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gcmq())
    .pipe(rename({ basename: 'main' }))
    .pipe(dest(`${build.css}/`))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(`${build.css}/`))
}

export function jsLibs() {
  return src(`${source.js}/libs.js`)
    .pipe(plumber({ errorHandler }))
    .pipe(rollup({
      plugins: [
        resolve()
      ]
    }, 'iife'))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(`${build.js}/`))
    .pipe(Server.stream())
}

export function jsDev() {
  return src(`${source.js}/app.js`)
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [
        babel()
      ]
    }, 'iife'))
    .pipe(sourcemaps.write(''))
    .pipe(rename({ basename: 'scripts' }))
    .pipe(dest(`${build.js}/`))
    .pipe(Server.stream())
}

export function jsBuild() {
  return src(`${source.js}/app.js`)
    .pipe(plumber({ errorHandler }))
    .pipe(rollup({
      plugins: [
        babel()
      ]
    }, 'iife'))
    .pipe(rename({ basename: 'scripts' }))
    .pipe(dest(`${build.js}/`))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(`${build.js}/`))
}

export function imgCopy() {
  return src(`${source.img}/**/*.{png,jpg,jpeg,webp,svg}`)
    .pipe(plumber({ errorHandler }))
    .pipe(dest(`${build.img}/`))
}

export function fonts() {
  return src(`${source.fonts}/**/*.*`)
    .pipe(plumber({ errorHandler }))
    .pipe(dest(`${build.fonts}/`))
}

export function emailCopy() {
  return src(`${source.email}/**/*.*`)
    .pipe(plumber({ errorHandler }))
    .pipe(dest(`${build.email}/`))
}

export function watchFiles() {
  watch(`${source.pug}/**/*.pug`, series('html'))
  watch(`${source.css}/**/*.scss`, series('stylesDev'))
  watch(`${source.js}/**/*.js`, series('jsDev'))
  watch(`${source.img}/**/*.{png,jpg,jpeg,webp,svg}`, series('imgCopy'))
  watch(`${source.email}/**/*.*`, series('emailCopy'))
}

const taskDev = series(
  clean,
  parallel(html, stylesDev, jsLibs, jsDev, imgCopy, fonts, emailCopy, serverInit, watchFiles)
)

const taskBuild = series(
  clean,
  parallel(html, stylesBuild, jsLibs, jsBuild, imgCopy, fonts, emailCopy)
)

export { taskDev as default, taskBuild as build }