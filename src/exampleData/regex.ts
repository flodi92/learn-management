type RegexTask = {
  id?: string;
  parentIds?: string;
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  nots?: RegExp[];
};

const simpleExpressionsCharacterClasses: RegexTask[] = [
  {
    expression: /^[xyz]$/,
    positiveExamples: ['x', 'z'],
    negativeExamples: ['a', 'xy', ''],
  },
  {
    nots: [/^\ba\b$/],
    expression: /^[^xyz]$/,
    positiveExamples: ['a', '0'],
    negativeExamples: ['x', 'z', ''],
  },
  {
    expression: /^.$/,
    positiveExamples: ['a', '1', '!', '\b', '\0', '\x01', '\v', '\f'],
    negativeExamples: ['', 'aa', '\n'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^a$/,
    positiveExamples: ['a'],
    negativeExamples: [
      'b',
      'A',
      'aa',
      '',
      '__regex_task_rejector__',
      'ABC',
      'hello',
      'abc',
      '_a_',
      'a1',
    ],
    nots: [
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^\s$/,
    positiveExamples: [' ', '\n', '\t'],
    negativeExamples: ['a', '1', '!'],
  },
  {
    expression: /^\d$/,
    positiveExamples: ['0', '1'],
    negativeExamples: ['a', ' ', '_', '\b', '\0', '\x01', '\v', '\f', '😀'],
  },
  {
    expression: /^\w$/,
    positiveExamples: ['a', '7', '_'],
    negativeExamples: ['!', '-', ' '],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^\W$/,
    positiveExamples: ['!', '\n'],
    negativeExamples: ['a', '7', '_'],
    nots: [/^\0$/],
  },
  {
    expression: /^\D$/,
    positiveExamples: ['a', '!', '\n'],
    negativeExamples: ['0', '5'],
    nots: [/^\0$/, /^\ba\b$/],
  },
  {
    expression: /^\S$/,
    positiveExamples: ['a', '!'],
    negativeExamples: [' ', '\n', '\t'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^\t$/,
    positiveExamples: ['\t'],
    negativeExamples: [' ', '\n', 't'],
  },
  {
    expression: /^\r$/,
    positiveExamples: ['\r'],
    negativeExamples: ['\n', 'r', ' '],
  },
  {
    expression: /^\n$/,
    positiveExamples: ['\n'],
    negativeExamples: ['\r', 'n', ' '],
  },
  {
    expression: /^\v$/,
    positiveExamples: ['\v'],
    negativeExamples: ['\n', 'v', ' '],
  },
  {
    expression: /^\f$/,
    positiveExamples: ['\f'],
    negativeExamples: ['\n', 'f', ' '],
  },
  {
    expression: /^[\b]$/,
    positiveExamples: ['\b'],
    negativeExamples: ['b', ' ', ''],
  },
  {
    expression: /^\0$/,
    positiveExamples: ['\0'],
    negativeExamples: ['0', '\\0', ''],
  },
  {
    expression: /^\cA$/,
    positiveExamples: ['\x01'],
    negativeExamples: ['A', '\x02', ''],
  },
  {
    expression: /^\x41$/,
    positiveExamples: ['A'],
    negativeExamples: ['a', 'B', ''],
    nots: [/^\u0041$/],
  },
  {
    expression: /^\u0041$/,
    positiveExamples: ['A'],
    negativeExamples: ['a', 'B', ''],
    nots: [/^\x41$/],
  },
  {
    expression: /^\u{1F600}$/u,
    positiveExamples: ['😀'],
    negativeExamples: ['A', '😃', ''],
  },
  {
    expression: /^(x|y)$/,
    positiveExamples: ['x'],
    negativeExamples: ['z', 'xy', ''],
    nots: [/^[\s\S]*$/],
  },
];

const simpleExpressionsAssertions: RegexTask[] = [
  {
    expression: /^a/,
    positiveExamples: ['abc', 'a'],
    negativeExamples: ['ba', ''],
  },
  {
    expression: /a$/,
    positiveExamples: ['a', 'cba'],
    negativeExamples: ['ab', ''],
    nots: [/^a+$/],
  },
  {
    expression: /^\ba\b$/,
    positiveExamples: ['a'],
    negativeExamples: ['ba', 'ab', 'a a'],
    nots: [/^a$/, /^(a)$/, /^(?<letter>a)$/, /^(?:a)$/, /^a$/d, /^a$/g, /^a$/y],
  },
  {
    expression: /^_\Ba\B_$/,
    positiveExamples: ['_a_'],
    negativeExamples: ['a', ' a ', 'ab'],
  },
  {
    expression: /^a(?=b)\w$/,
    positiveExamples: ['ab'],
    negativeExamples: ['ac', 'a', 'ba'],
  },
  {
    expression: /^a(?!b).$/,
    positiveExamples: ['ac', 'a1'],
    negativeExamples: ['ab', 'a', 'ba'],
    nots: [/^(a)\1$/, /^(?<letter>a)\k<letter>$/, /^a{2}$/],
  },
  {
    expression: /(?<=b)a$/,
    positiveExamples: ['ba'],
    negativeExamples: ['a', 'ca', 'ab'],
  },
  {
    expression: /(?<!b)a$/,
    positiveExamples: ['a', 'ca'],
    negativeExamples: ['ba', 'ab'],
    nots: [/^a+$/],
  },
];

const simpleExpressionsGroups: RegexTask[] = [
  {
    expression: /^(a)$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^(?<letter>a)$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [/^a$/, /^\ba\b$/, /^(a)$/, /^(?:a)$/, /^a$/d, /^a$/g, /^a$/y],
  },
  {
    expression: /^(?:a)$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [/^a$/, /^\ba\b$/, /^(a)$/, /^(?<letter>a)$/, /^a$/d, /^a$/g, /^a$/y],
  },
  {
    expression: /^(a)\1$/,
    positiveExamples: ['aa'],
    negativeExamples: ['a', 'ab', 'aaa'],
    nots: [/^a{2}$/, /^(?<letter>a)\k<letter>$/],
  },
  {
    expression: /^(?<letter>a)\k<letter>$/,
    positiveExamples: ['aa'],
    negativeExamples: ['a', 'ab', 'aaa'],
    nots: [/^a{2}$/, /^(a)\1$/],
  },
];

const simpleExpressionsQuantifiers: RegexTask[] = [
  {
    expression: /^a+$/,
    positiveExamples: ['a', 'aaa'],
    negativeExamples: ['', 'b', 'aaab', 'abcabc', 'a\nb', 'x\na\ny'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^(abc)+$/,
    positiveExamples: ['abc', 'abcabc'],
    negativeExamples: ['', 'ab', 'cba'],
  },
  {
    expression: /^a*$/,
    positiveExamples: ['', 'a', 'aaa'],
    negativeExamples: ['b', 'aaab', 'abcabc'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^(abc)*$/,
    positiveExamples: ['', 'abc', 'abcabc'],
    negativeExamples: ['ab', 'cba'],
  },
  {
    expression: /^a?$/,
    positiveExamples: ['', 'a'],
    negativeExamples: ['aa', 'b', 'ab'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^a{2}$/,
    positiveExamples: ['aa'],
    negativeExamples: ['a', 'aaa', ''],
    nots: [/^(a)\1$/, /^(?<letter>a)\k<letter>$/],
  },
  {
    expression: /^a{2,}$/,
    positiveExamples: ['aa', 'aaa'],
    negativeExamples: ['', 'a', 'ab'],
  },
  {
    expression: /^a{2,3}$/,
    positiveExamples: ['aa', 'aaa'],
    negativeExamples: ['', 'a', 'aaaa'],
    nots: [/^a{2,}$/],
  },
];

const simpleExpressionsModifiers: RegexTask[] = [
  {
    expression: /^abc$/i,
    positiveExamples: ['ABC', 'abc'],
    negativeExamples: ['abd', 'ab', ''],
  },
  {
    expression: /^a.b$/s,
    positiveExamples: ['a\nb'],
    negativeExamples: ['ab', 'a\nb\n', 'ac'],
  },
  {
    expression: /^a$/m,
    positiveExamples: ['x\na\ny'],
    negativeExamples: ['x\nb\ny', 'ba', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^.$/u,
    positiveExamples: ['😀', 'a'],
    negativeExamples: ['', '😀😀'],
    nots: [/^.$/, /^\ba\b$/],
  },
  {
    expression: /^[\p{ASCII}&&\p{Letter}]+$/v,
    positiveExamples: ['ABC', 'hello'],
    negativeExamples: ['123', 'ä', '', 'abc123'],
  },
  {
    expression: /^a$/d,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^a$/g,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/y,
    ],
  },
  {
    expression: /^a$/y,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
    ],
  },
];

const simpleCombinationsCharacterClassesAndQuantifiers: RegexTask[] = [
  {
    expression: /^[a-z]{2}\d$/,
    positiveExamples: ['ab1', 'xy9'],
    negativeExamples: ['a1', 'abc1', 'AB1', 'ab12', 'AB12', 'CD34'],
  },
  {
    expression: /^[A-Z]{2}\d{2}$/,
    positiveExamples: ['AB12', 'CD34'],
    negativeExamples: ['AB1', 'ABC12', 'ab12', '12abc', '34def'],
  },
  {
    expression: /^\d{2}[a-f]+$/,
    positiveExamples: ['12abc', '34def'],
    negativeExamples: ['12ab7', '1abc', '12ABC', 'Alice', 'Zed'],
  },
  {
    expression: /^[A-Z][a-z]{2,4}$/,
    positiveExamples: ['Alice', 'Zed'],
    negativeExamples: ['Al', 'ALICE', 'Alicea', 'usr-42', 'dev-07'],
  },
  {
    expression: /^\w{3}-\d{2}$/,
    positiveExamples: ['usr-42', 'dev-07'],
    negativeExamples: [
      'us-42',
      'user-42',
      'usr-4',
      'sam@site.de',
      'me@host.io',
    ],
  },
  {
    expression: /^[^\s]+@[a-z]{3,}\.[a-z]{2,}$/,
    positiveExamples: ['sam@site.de', 'me@host.io'],
    negativeExamples: [
      'sam@de',
      'sam @site.de',
      'sam@SITE.de',
      '2026X',
      '1999',
    ],
  },
  {
    expression: /^[0-9]{4}[A-Z]?$/,
    positiveExamples: ['2026X', '1999'],
    negativeExamples: ['202X', '20266', '2026x', 'a1b2c3', 'c0ffee'],
  },
  {
    expression: /^[a-f0-9]{6}$/,
    positiveExamples: ['a1b2c3', 'c0ffee'],
    negativeExamples: ['a1b2c', 'A1B2C3', 'a1b2cg', 'code7', 'word8'],
  },
  {
    expression: /^[^0-9]{2,4}\d+$/,
    positiveExamples: ['code7', 'word8'],
    negativeExamples: ['a7', 'abcde7', 'co7de', 'USER_2', 'CONST_3'],
  },
  {
    expression: /^[A-Z_][A-Z0-9_]*$/,
    positiveExamples: ['USER_2', 'CONST_3'],
    negativeExamples: ['2USER', 'user_2', 'USER-2', 'item4', 'key7'],
  },
];

const simpleCombinationsAssertionsAndCharacterClasses: RegexTask[] = [
  {
    expression: /^item(?=\d)\d$/,
    positiveExamples: ['item4', 'item9'],
    negativeExamples: ['item', 'item42', 'itemx', 'keyvalue'],
  },
  {
    expression: /^key(?!\d)[a-z]+$/,
    positiveExamples: ['keyvalue', 'keyname'],
    negativeExamples: ['key4', 'keyValue', 'key', 'ID:204'],
  },
  {
    expression: /(?<=ID:)\d{3}$/,
    positiveExamples: ['ID:204', 'ID:999'],
    negativeExamples: ['204', 'ID:20', 'code:204', 'Berlin'],
  },
  {
    expression: /(?<!ID:)\d{3}$/,
    positiveExamples: ['204', '999'],
    negativeExamples: ['ID:204', '1204', 'Berlin'],
  },
  {
    expression: /^\b[A-Z][a-z]+\b$/,
    positiveExamples: ['Berlin', 'Paris'],
    negativeExamples: ['berlin', 'BERLIN', '_Berlin_', '_word_'],
  },
  {
    expression: /^_\B[a-z]+\B_$/,
    positiveExamples: ['_word_', '_name_'],
    negativeExamples: ['word', '_Word_', '_word', '5kg'],
  },
  {
    expression: /^\d+(?=kg)kg$/,
    positiveExamples: ['5kg', '12kg'],
    negativeExamples: ['kg', '5g', '5kgs', 'file'],
  },
  {
    expression: /^\S+(?!\.)$/,
    positiveExamples: ['file', 'report'],
    negativeExamples: ['file.', 'two words', '', '12-34'],
  },
  {
    expression: /^(?<!-)\d{2}-\d{2}$/,
    positiveExamples: ['12-34', '56-78'],
    negativeExamples: ['-12-34', '123-45', '12-345', 'name:'],
  },
  {
    expression: /^\w+(?=:):$/,
    positiveExamples: ['name:', 'key:'],
    negativeExamples: ['name', 'name::', 'two words:', 'abab'],
  },
];

const simpleCombinationsGroupsAndQuantifiers: RegexTask[] = [
  {
    expression: /^(ab)+$/,
    positiveExamples: ['ab', 'abab'],
    negativeExamples: ['', 'a', 'aba', 'haha!'],
  },
  {
    expression: /^(ha){2,3}!$/,
    positiveExamples: ['haha!', 'hahaha!'],
    negativeExamples: ['ha!', 'hahahaha!', 'haha', 'xyzzz'],
  },
  {
    expression: /^(xy)?z+$/,
    positiveExamples: ['z', 'xyzzz'],
    negativeExamples: ['xy', 'xyzx', 'xzzz', 'catdog'],
  },
  {
    expression: /^(cat|dog){2}$/,
    positiveExamples: ['catdog', 'dogcat'],
    negativeExamples: ['cat', 'catdogcat', 'catfish', 'redblue'],
  },
  {
    expression: /^(red|blue)+$/,
    positiveExamples: ['redblue', 'blueredred'],
    negativeExamples: ['red', 'bluegreen', 'red blue', '12-34-56'],
  },
  {
    expression: /^(\d{2}-){2}\d{2}$/,
    positiveExamples: ['12-34-56', '00-99-10'],
    negativeExamples: ['12-34', '123-45-67', '12/34/56', 'go go'],
  },
  {
    expression: /^(?:go\s*)+$/,
    positiveExamples: ['go', 'go go'],
    negativeExamples: ['', 'go no', 'gone', 'yes'],
  },
  {
    expression: /^(yes|no)?$/,
    positiveExamples: ['', 'yes', 'no'],
    negativeExamples: ['Yes', 'yesno', 'maybe', 'AbCd'],
  },
  {
    expression: /^([A-Z][a-z]){2,}$/,
    positiveExamples: ['AbCd', 'AbCdEf'],
    negativeExamples: ['Ab', 'ABCD', 'AbCde', '010101'],
  },
  {
    expression: /^(?:0|1){4,6}$/,
    positiveExamples: ['0101', '010101'],
    negativeExamples: ['010', '0101010', '0121', 'item-7'],
  },
];

const simpleCombinationsGroupsAndCharacterClasses: RegexTask[] = [
  {
    expression: /^(?<word>[a-z]+)-\d+$/,
    positiveExamples: ['item-7', 'task-42'],
    negativeExamples: ['item-', 'Item-7', 'item-seven', 'AB_12'],
  },
  {
    expression: /^(?:[A-Z]{2})_[0-9]+$/,
    positiveExamples: ['AB_12', 'XY_7'],
    negativeExamples: ['A_12', 'ABC_12', 'ab_12', 'readme.md'],
  },
  {
    expression: /^(\w+)\.(?:txt|md)$/,
    positiveExamples: ['readme.md', 'notes.txt'],
    negativeExamples: [
      'readme.pdf',
      '.md',
      'read me.md',
      'https://example.org',
    ],
  },
  {
    expression: /^(?:https?|ftp):\/\/\S+$/,
    positiveExamples: ['https://example.org', 'ftp://files.net'],
    negativeExamples: [
      'example.org',
      'http://',
      'https://two words',
      '+49 12345',
    ],
  },
  {
    expression: /^(?:\+\d{1,3})?\s?\d{4,}$/,
    positiveExamples: ['+49 12345', '12345'],
    negativeExamples: ['+4 123', '+1234 12345', '12 345', 'J.Doe'],
  },
  {
    expression: /^(?<initial>[A-Z])\.[a-z]+$/,
    positiveExamples: ['J.Doe', 'A.smith'],
    negativeExamples: ['JDoe', 'j.Doe', 'J.DOE', 'mon 09:30'],
  },
  {
    expression: /^(?:mon|tue|wed)\s\d{2}:\d{2}$/,
    positiveExamples: ['mon 09:30', 'wed 18:05'],
    negativeExamples: ['thu 09:30', 'mon 9:30', 'mon-09:30', '2026/09/23'],
  },
  {
    expression: /^(\d{4})[-/]\d{2}[-/]\d{2}$/,
    positiveExamples: ['2026/09/23', '1999-12-31'],
    negativeExamples: ['2026.09.23', '26/09/23', '2026/9/23', '#abc123'],
  },
  {
    expression: /^#[a-f0-9]{3,6}$/,
    positiveExamples: ['#abc', '#abc123'],
    negativeExamples: ['#ab', '#abcdef0', '#ABC123', 'Smith, Jones, Brown'],
  },
  {
    expression: /^(?:[A-Z][a-z]+,\s?){2}[A-Z][a-z]+$/,
    positiveExamples: ['Smith, Jones, Brown', 'Ada, Bob, Carol'],
    negativeExamples: [
      'Smith, Jones',
      'Smith; Jones; Brown',
      'smith, Jones, Brown',
      'HaAa',
    ],
  },
];

const simpleCombinationsQuantifiersAndModifiers: RegexTask[] = [
  {
    expression: /^ha+$/i,
    positiveExamples: ['ha', 'HaAa'],
    negativeExamples: ['h', 'haa!', 'hb', 'a\nbbb'],
  },
  {
    expression: /^a.b+$/s,
    positiveExamples: ['acb', 'a\nbbb'],
    negativeExamples: ['ab', 'ac', 'a\nbbb\n', 'go\ngo'],
  },
  {
    expression: /^(?:go\s*)+$/m,
    positiveExamples: ['go', 'go\ngo'],
    negativeExamples: ['go no', 'gone', '\ngo', 'cafe'],
  },
  {
    expression: /^\p{L}{3,}$/u,
    positiveExamples: ['cafe', 'grün'],
    negativeExamples: ['ab', 'cafe7', 'two words', '2048'],
  },
  {
    expression: /^\d{2,4}$/d,
    positiveExamples: ['20', '2048'],
    negativeExamples: ['2', '20480', '20a', 'XXx'],
  },
  {
    expression: /^x{2,3}$/i,
    positiveExamples: ['xx', 'XXx'],
    negativeExamples: ['x', 'xxxx', 'xy', '  Hello  '],
  },
  {
    expression: /^\s*[a-z]+\s*$/i,
    positiveExamples: ['Hello', '  Hello  '],
    negativeExamples: ['Hello7', 'two words', '!', 'a\n!'],
  },
  {
    expression: /^.{2,4}$/s,
    positiveExamples: ['ab', 'a\n!'],
    negativeExamples: ['a', 'abcde', '', 'aabbc'],
  },
  {
    expression: /^(?:ab?)+$/u,
    positiveExamples: ['a', 'aabb'],
    negativeExamples: ['', 'b', 'abaac', 'abc'],
  },
  {
    expression: /^\w{2,5}$/y,
    positiveExamples: ['ab', 'abc'],
    negativeExamples: ['a', 'abcdef', 'a-b', 'Pass7!'],
  },
];

const simpleCombinationsAssertionsAndQuantifiers: RegexTask[] = [
  {
    expression: /^a(?=b)b+$/,
    positiveExamples: ['ab', 'abbb'],
    negativeExamples: ['a', 'ac', 'ba', 'accc'],
  },
  {
    expression: /^a(?!b)c+$/,
    positiveExamples: ['ac', 'accc'],
    negativeExamples: ['ab', 'a', 'accb', '#tag'],
  },
  {
    expression: /^(?<=#)\w+$/,
    positiveExamples: ['#tag', '#todo_1'],
    negativeExamples: ['tag', '#two words', '#', 'word'],
  },
  {
    expression: /^(?<!#)\w+$/,
    positiveExamples: ['tag', 'word'],
    negativeExamples: ['#tag', 'two words', 'tag!', '_word_'],
  },
  {
    expression: /^\b[a-z]+\b$/,
    positiveExamples: ['word', 'clean'],
    negativeExamples: ['Word', '_word_', 'word7', 'two words'],
  },
  {
    expression: /^_\B[a-z]+\B_$/,
    positiveExamples: ['_word_', '_name_'],
    negativeExamples: ['word', '_Word_', '_word', '3 items'],
  },
  {
    expression: /^\d+(?=\sitems?)$/,
    positiveExamples: ['3 item', '12 items'],
    negativeExamples: ['items', '3 boxes', '3items', 'clean'],
  },
  {
    expression: /^(?!.*\s)[a-z]{4,}$/,
    positiveExamples: ['clean', 'word'],
    negativeExamples: ['abc', 'two words', 'Word', 'Pass7'],
  },
  {
    expression: /^(?=.*[A-Z])(?=.*\d)\w+$/,
    positiveExamples: ['Pass7', 'A1'],
    negativeExamples: ['pass7', 'PASS', '1234', 'Pass!7'],
  },
  {
    expression: /^(?!0)\d{3,}$/,
    positiveExamples: ['123', '1234'],
    negativeExamples: ['0123', '12', '12a', 'Berlin'],
  },
];

const simpleCombinationsCharacterClassesAndModifiers: RegexTask[] = [
  {
    expression: /^[a-z]+$/i,
    positiveExamples: ['Berlin', 'abc'],
    negativeExamples: ['äö', 'abc7', 'two words', ''],
  },
  {
    expression: /^[^\p{ASCII}]+$/u,
    positiveExamples: ['äö', '😀'],
    negativeExamples: ['a', 'äa', 'hello world', ''],
  },
  {
    expression: /^[\p{Letter}\s]+$/u,
    positiveExamples: ['hello world', 'grün blau'],
    negativeExamples: ['User_7', 'hello!', '123', ''],
  },
  {
    expression: /^[a-z\d_]+$/i,
    positiveExamples: ['User_7', 'abc123'],
    negativeExamples: ['user-name', 'ä', 'two words', 'line\r'],
  },
  {
    expression: /^[^\n]+$/s,
    positiveExamples: ['line\r', 'ABC123'],
    negativeExamples: ['line\nnext', '', '\n'],
  },
  {
    expression: /^[A-Z\d]+$/m,
    positiveExamples: ['ABC123', 'X9'],
    negativeExamples: ['abc', 'ABC!', 'A B', 'Letters'],
  },
  {
    expression: /^[\p{ASCII}&&\p{Letter}]+$/v,
    positiveExamples: ['Letters', 'abc'],
    negativeExamples: ['ABC123', 'ä', 'two words', 'A.User@Host'],
  },
  {
    expression: /^[\w.-]+@[\w.-]+$/i,
    positiveExamples: ['A.User@Host', 'me-2@site.de'],
    negativeExamples: ['user@', '@host', 'user @host', '123!'],
  },
  {
    expression: /^[^a-z]+$/i,
    positiveExamples: ['123!', '１２３'],
    negativeExamples: ['a', 'ABC', 'a1', 'HELLO'],
  },
  {
    expression: /^[\p{Number}]+$/u,
    positiveExamples: ['１２３', '123'],
    negativeExamples: ['12a', '!', ' 123', 'HELLO'],
  },
];

const simpleCombinationsAssertionsAndModifiers: RegexTask[] = [
  {
    expression: /^hello$/i,
    positiveExamples: ['hello', 'HELLO'],
    negativeExamples: ['hello!', 'say hello', 'hell', 'a\nb'],
  },
  {
    expression: /^.+$/s,
    positiveExamples: ['a\nb', 'x\nitem\ny'],
    negativeExamples: [''],
  },
  {
    expression: /^item$/m,
    positiveExamples: ['item', 'x\nitem\ny'],
    negativeExamples: ['items', 'x\nitemized\ny', 'the END'],
  },
  {
    expression: /\bend\b$/i,
    positiveExamples: ['end', 'the END'],
    negativeExamples: ['ending', 'end!', 'weekend', 'starter'],
  },
  {
    expression: /^start\B/i,
    positiveExamples: ['starter', 'starting'],
    negativeExamples: ['start', 'Start!', 'restart', 'javascript'],
  },
  {
    expression: /^Java(?=Script)Script$/i,
    positiveExamples: ['javascript', 'JAVASCRIPT'],
    negativeExamples: ['Java', 'Java Script', 'JavaBeans'],
  },
  {
    expression: /^Java(?!Script).+$/i,
    positiveExamples: ['JavaBeans', 'JavaFX'],
    negativeExamples: ['JavaScript', 'Java', 'say Hello'],
  },
  {
    expression: /(?<=say\s)hello$/i,
    positiveExamples: ['say hello', 'say Hello'],
    negativeExamples: ['sayhello', 'say hello!', 'well HELLO'],
  },
  {
    expression: /(?<!say\s)hello$/i,
    positiveExamples: ['hello', 'well HELLO'],
    negativeExamples: ['say hello', 'hello!', 'name.'],
  },
  {
    expression: /^\S+(?=\.)\.$/i,
    positiveExamples: ['name.', 'FILE.'],
    negativeExamples: ['name', 'two words.', 'name..', 'name: value'],
  },
];

const simpleCombinationsGroupsAndAssertions: RegexTask[] = [
  {
    expression: /^(?<key>\w+):(?=\s)/,
    positiveExamples: ['name: value', 'id: 42'],
    negativeExamples: [
      'name:value',
      'name:',
      'two words: value',
      'https://example.com',
    ],
  },
  {
    expression: /^(?:https?):\/\/(?!localhost)\S+$/,
    positiveExamples: ['https://example.com', 'http://site.test'],
    negativeExamples: [
      'https://localhost',
      'ftp://example.com',
      'https://two words',
      'go go',
    ],
  },
  {
    expression: /^(\w+)\s+\1$/,
    positiveExamples: ['go go', 'word  word'],
    negativeExamples: ['go no', 'go-go', 'yes yes!'],
  },
  {
    expression: /^(?<word>\w+)\s+\k<word>$/,
    positiveExamples: ['yes yes', 'tag tag'],
    negativeExamples: ['yes no', 'tag-tag', 'Ms. Smith'],
  },
  {
    expression: /^(?:Mr|Ms)\.\s(?=[A-Z])[A-Z][a-z]+$/,
    positiveExamples: ['Ms. Smith', 'Mr. Jones'],
    negativeExamples: ['Ms.Smith', 'Mrs. Smith', 'Ms. smith', '09/23'],
  },
  {
    expression: /^(\d{2})(?=\/\d{2})\/\d{2}$/,
    positiveExamples: ['09/23', '12/31'],
    negativeExamples: ['9/23', '09-23', '09/234', '555-1234'],
  },
  {
    expression: /^(?<area>\d{3})-\d{4}(?<!0)$/,
    positiveExamples: ['555-1234', '123-4567'],
    negativeExamples: ['55-1234', '555-1230', '5551234', 'cat'],
  },
  {
    expression: /^(?:cat|dog)(?!fish)$/,
    positiveExamples: ['cat', 'dog'],
    negativeExamples: ['catfish', 'dogfish', 'bird', 'this is'],
  },
  {
    expression: /^(\w+)(?=\sis)\s+is$/,
    positiveExamples: ['this is', 'code is'],
    negativeExamples: ['this was', 'thisis', 'two words is', 'ready'],
  },
  {
    expression: /^(?<!not\s)(?:ready|done)$/,
    positiveExamples: ['ready', 'done'],
    negativeExamples: ['not ready', 'already', 'done!', 'aaabbb'],
  },
];

const simpleCombinationsSeveralQuantifiers: RegexTask[] = [
  {
    expression: /^a*b+$/,
    positiveExamples: ['b', 'aaabbb'],
    negativeExamples: ['', 'aaa', 'ba', 'abx', '12-AB'],
  },
  {
    expression: /^\d{2,4}-?[A-Z]+$/,
    positiveExamples: ['12AB', '1234-AB'],
    negativeExamples: ['1AB', '12345AB', '12-ab', 'abc12def3'],
  },
  {
    expression: /^(?:[a-z]+\d?)+$/,
    positiveExamples: ['abc1', 'abc1def3'],
    negativeExamples: ['ABC1', 'abc123', 'abc-def', 'hahaha!'],
  },
  {
    expression: /^(?:ha)+!?$/,
    positiveExamples: ['ha', 'hahaha!'],
    negativeExamples: ['h', 'haha!!', 'hah', 'site.example'],
  },
  {
    expression: /^\w+\.\w{2,4}$/,
    positiveExamples: ['site.io', 'site.test'],
    negativeExamples: ['site.c', 'site.abcde', 'site-name.io', '01:02:03'],
  },
  {
    expression: /^(?:\d{1,2}:){2}\d{2}$/,
    positiveExamples: ['1:2:03', '01:02:03'],
    negativeExamples: ['1:2:3', '001:02:03', '01-02-03', '-12.50'],
  },
  {
    expression: /^-?\d+(?:\.\d+)?$/,
    positiveExamples: ['12', '-12.50'],
    negativeExamples: ['-12.', '.50', '12,50', 'www.example.com'],
  },
  {
    expression: /^(?:https?:\/\/)?[\w.-]+\.[a-z]{2,}$/,
    positiveExamples: ['www.example.com', 'https://site.io'],
    negativeExamples: ['site.c', 'ftp://site.io', 'site.123', 'NaCl'],
  },
  {
    expression: /^(?:[A-Z][a-z]?){2,4}$/,
    positiveExamples: ['NaCl', 'NaClFe'],
    negativeExamples: ['N', 'NaClFeCuZn', 'nacl', 'one-two-three'],
  },
  {
    expression: /^(?:\w+[- ]){1,3}\w+$/,
    positiveExamples: ['one-two', 'one-two-three'],
    negativeExamples: ['one', 'one-two-three-four-five', 'one--two', 'ab1'],
  },
];

const simpleExpressionsTestContract: RegexTask[] = [
  {
    expression: /^[\s\S]*$/,
    positiveExamples: ['x', 'A', '\n'],
  },
  {
    expression: /^__regex_task_rejector__$/,
    positiveExamples: ['__regex_task_rejector__'],
    negativeExamples: ['x', 'z', 'y', '%', 'a', '0', '1', '!', '\n', 'A'],
  },
];

const allTasks: RegexTask[] = [
  ...simpleExpressionsCharacterClasses,
  ...simpleExpressionsAssertions,
  ...simpleExpressionsGroups,
  ...simpleExpressionsQuantifiers,
  ...simpleExpressionsModifiers,
  ...simpleCombinationsCharacterClassesAndQuantifiers,
  ...simpleCombinationsAssertionsAndCharacterClasses,
  ...simpleCombinationsGroupsAndQuantifiers,
  ...simpleCombinationsGroupsAndCharacterClasses,
  ...simpleCombinationsQuantifiersAndModifiers,
  ...simpleCombinationsAssertionsAndQuantifiers,
  ...simpleCombinationsCharacterClassesAndModifiers,
  ...simpleCombinationsAssertionsAndModifiers,
  ...simpleCombinationsGroupsAndAssertions,
  ...simpleCombinationsSeveralQuantifiers,
  ...simpleExpressionsTestContract,
];

export const tasks: RegexTask[] = allTasks;
