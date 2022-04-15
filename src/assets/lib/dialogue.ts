type Arguments = string[]

export const welcome = (args: Arguments = ['welcome']): string[] => {
  return [
    '<span class="b">Welcome to aSearch!</span>' +
      (args[1] ? ` ${args[1]}` : ''),
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
    ' ',
  ]
}

export const errorCmd = (args: Arguments): string[] => {
  return [
    `<span class="r">Command "${args[0]}" not found. Please check the spelling of the name.</span>`,
    ' ',
    'To search for article content, please use <span class="o">search &lt;keywords&gt;</span>',
    ' ',
  ]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const result = (args: Arguments): string[] => {
  return [
    '<span class="g">results</span>',
    ' ',
    '| id | hash   | date           | title                                                               |',
    `| <a class="b" href="/" target="_blank">12</a> | 0x1234 | April 14, 2022 | Our Apollo Mission: Let's Go to the Moon and Earn Up to 5,000 USDT! |`,
    '| <a class="b" href="/" target="_blank">16</a> | 0x2134 | April 14, 2022 | 2022-4-14SEOR Moonbeam                                              |',
    '| <a class="b" href="/" target="_blank">20</a> | 0x1134 | April 14, 2022 | Blockchain: A decentralized postmodernist philosophical discourse   |',
    ' ',
    '<span class="d">use <span class="o">open &lt;id&gt;</span> to read more</span>',
    ' ',
  ]
}
