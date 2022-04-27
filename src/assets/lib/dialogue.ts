import testdata from './search_data'

type Arguments = string[]

type Command = (
  args: Arguments,
  activelogs: string[]
) => Promise<boolean> | boolean

const toLink = (name: string, url: string) => {
  return `<a class="b" href="${url}" target="_blank">${name}</a>`
}
const toContent = (content: string) => {
  return `<span class="d">${content}</span>`
}

export const welcome: Command = (args, logs) => {
  const name = args[1]
  logs.push(
    '<span class="b">Welcome to aSearch!</span>' + (name ? ` ${name}` : ''),
    ' ',
    '                          :-:                     ',
    '                        .==-+:                    ',
    '                       .==. :+- .-=-              ',
    '                      .==.   :==++-+=.            ',
    '                     :==.     -**: :+=.           ',
    '                    :+-      :*+++. .++.          ',
    '                   :+-      -*= .++: .=+.         ',
    '                  -+:      =*-   .+*: .=+:        ',
    '                 -+:     .=*-     .=*-  =+:       ',
    '               .==:     .+*:        -*-  -+-      ',
    '              .=+:.....:+*-.........:=*=..=*-     ',
    '              .-=------=++============++====:     ',
    ' ',
    '              <span class="y">Thanks for installing nuxtjs 🙏</span>',
    '      <span class="d">Please consider donating to our open collective</span>',
    '             <span class="d">to help us maintain this package.</span>',
    ' ',
    '                 Number of contributors: 0',
    '                   Number of backers: 473',
    '                 Annual budget: US$ 60,677',
    '                Current balance: US$ 11,587',
    ' ',
    '👉  Donate: https://opencollective.com/nuxtjs/donate',
    ' '
  )
  return true
}

export const errorCmd: Command = (args, logs) => {
  logs.push(
    `<span class="r">Command "${args[0]}" not found. Please check the spelling of the name.</span>`,
    ' ',
    'To search for article content, please use <span class="o">search &lt;keywords&gt;</span>',
    ' '
  )
  return false
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const search = (args: Arguments): string[] => {
//   return [
//     '<span class="g">results</span>',
//     ' ',
//     '| id | hash   | date           | title                                                               |',
//     `| <a class="b" href="/" target="_blank">12</a> | 0x1234 | April 14, 2022 | Our Apollo Mission: Let's Go to the Moon and Earn Up to 5,000 USDT! |`,
//     '| <a class="b" href="/" target="_blank">16</a> | 0x2134 | April 14, 2022 | 2022-4-14SEOR Moonbeam                                              |',
//     '| <a class="b" href="/" target="_blank">20</a> | 0x1134 | April 14, 2022 | Blockchain: A decentralized postmodernist philosophical discourse   |',
//     ' ',
//     '<span class="d">use <span class="o">open &lt;id&gt;</span> to read more</span>',
//     ' ',
//   ]
// }
export const search: Command = async (args, logs) => {
  const keywords = args[1]
  if (!keywords) {
    logs.push(
      `<span class="r">Invalid search!</span>`,
      ' ',
      'To search for article content, please use <span class="o">search &lt;keywords&gt;</span>',
      ' '
    )
    return false
  }

  return fetch('http://asearch.io/search_mirror?q=' + encodeURI(keywords))
    .then((res) => res.json)
    .then((res: any) => {
      const cols = 80
      const rows = 2
      const w = cols - 4
      const msgs = res.data.map((item: any) => {
        let title = item.title.trim()
        if (title.length > w) {
          title = title.substring(0, w - 3)
        }
        title = toLink(title, item.link) + ''.padEnd(w - title.length, ' ')

        const date = `date: ${item.publishedAt}`.padEnd(w, ' ')

        const div = document.createElement('div')
        div.innerHTML = item.content.replace(/<.+?>/g, '')
        let content = div.innerText.replace(/\n/g, ' ')
        const contentList: string[] = []
        for (let i = 1; i <= rows; i++) {
          let c = content.substring(0, w)
          content = content.substring(w).trimStart()
          if (i === rows) {
            c = c.substring(0, c.length - 3) + '...'
          }
          contentList.push(toContent(c.padEnd(w, ' ')))
        }
        return [
          `│ ${title} │`,
          `│ ${date} │`,
          ...contentList.map((c) => `│ ${c} │`),
        ]
      })
      for (let i = 0; i < msgs.length; i++) {
        if (i === 0) {
          logs.push('┌'.padEnd(cols - 1, '─') + '┐')
        } else {
          logs.push('├'.padEnd(cols - 1, '─') + '┤')
        }
        logs.push(...msgs[i])
      }
      logs.push('└'.padEnd(cols - 1, '─') + '┘', ' ')
      return true
    })
    .catch((err: Error) => {
      const msg = String(err).split('\n')
      console.log(msg)
      logs.push(...msg.map((m) => `<span class="r">${m}</span>`), ' ')
      return false
    })
}
