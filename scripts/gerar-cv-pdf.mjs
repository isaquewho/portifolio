// Gera public/Isaque_Araujo_Curriculo.pdf a partir de /curriculo usando o Edge/Chrome headless.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const url = process.env.CV_URL ?? 'http://localhost:3000/curriculo'
const saida = resolve('public/Isaque_Araujo_Curriculo.pdf')
const candidatos = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]
const navegador = candidatos.find((c) => existsSync(c))
if (!navegador) throw new Error('Nenhum Chrome/Edge encontrado')

execFileSync(navegador, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
  '--virtual-time-budget=8000', `--print-to-pdf=${saida}`, url,
], { stdio: 'inherit' })
console.log('PDF gerado em', saida)
