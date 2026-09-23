## guide lines

- try to find good examples that illustrate what the expression matches and what it does not match
- the examples should be chosen in a way that they pass the tests in regex.test.ts
- only add nots if it cannot be distinguished by positive and negative examples
- try to make the same examples in other tasks to make clear the commonalities and differences
- try to be complete and add an example for every type of string that is covered by the expression
- do not use logic in regex.ts file only use types with netsting objects, arrays, RegExp, string and number

## tasks

The following aspects should be provided in at least one task. If one aspect varies in usage there can be several tasks for each aspect. For those tasks there there are examples provided in the section ###examples as a starting point but they should not be adopted directly.

Side note: All tasks' expressions will use by default the start assertion ^ and the end assertion $. This is not counted as an own aspect. An exception are only those tasks that explicitly illustrate the usage of $ and ^ and leave out one or both.

1. Simple expressions that illustrate only one aspect

- character classes
  - [xyz], [^xyz], ., \d, \D, \w, \W, \s, \S, \t, \r, \n, \v, \f, [\b], \0, \cX, \xHH, \uHHHH, \u{H…H}, x|y
- assertions
  - ^, $, \b, \B, x(?=y), x(?!y), (?<=y)x, (?<!y)x, expression without ^ or $ or without both
- groups and backreferences
  - (x), (?<Name>x), (?:x), \n, \k<Name>
- quantifier
  - x*, x+, x?, x{n}, x{n,}, x{n,m}
- modifier
  - d, g, i, m, s u, v, y

2. Simple Combinations. Try to find typical cases for the following combinations. Try to cover the whole bunch of varieties that might be possible.

- several quantifiers in one expression that are nested in various ways
- various character classes concated after each other
- various combinations of modifiers
- various combinations of assertions
- all kinds of combinations that combine exactly two of the following aspects
  - character classes
  - assertions
  - groups and backreferences
  - quantifier
  - modifier

3. Complex Combinations. Try to find complex combinations and nestings that build on aspects that are mentioned in 1. Focus on typical combinations that might be a use case. If necessary use words rather than sign combinations.

### structure of tasks

- The tasks array should be a concatenation of various sub tasks array for each of the above mentioned aspect, e.g. simpleExpressionsCharacterClasses or simpleCombinationsAssertions
- Try to find an appropriate way on how to group tasks of complex combinations

### examples

The following examples should be used as a hint that illustrates the variety of expressions that might be used in a task. Those examples should not be adopted exactly for a task but changed slightly. The tasks that are derived from those examples might appear in any of the groups defined in "structure of tasks". Do not limit to the tasks directly derived from those examples but use all kinds of combinations or variations.

- /[Jj]avascript/
- /javascript/i
- /b+/
- /b\+/
- /skript|programm/
- /Gefunden in (suchmaschine|browser|portal)/
- /skript!?/
- /Ja*va/
- /Ja+va/
- /Progr{3}mm/
- /Progr{2,3}mm/
- /[aeiou]{3,}/
- /<li.*>/g
- /<li.*?>/
- /Einen (.*) Eintrag/
- /(Herr|Frau)\s+(\w+)/
- /(?:Herr|Frau)\s+(\w+)/
- /^Programm/
- /Programm$/
- /\bSkript\b/
- /\BSkript\b/
- /Java(?=Skript)/
- /JavaSkript(?!!)/
- /(\w.+)\s(\w.+)/
- /xy+c/
- /xyz/
- /xy*c/
- /Abschnitt (\d+)\.\d*/
- /x\*y/
- /x[*]y/
- /\/beispiel\/[a-z]+/i
- /[A-Z]:\\/
- /e(c+)e/g
- /\w+\s/g
- /\p{L}*/u
- /^(?:\d{3}|\(\d{3}\))([-/.])\d{3}\1\d{4}$/
- /begrüßung/
- /begrüßung/i
- /begrüßung/g
- /b.grüßung/
- /b.*g/
- /^begrüßung/
- /abschied!$/
- /\bbegrüßung\b/
- /[a-zA-Z]/
- /\d{4}/
- /b.+g/
- /begrüßung|abschied/
- /(beispiel) (text)/
- /(?:beispiel) (text)/
- /begrüßung(?= text)/
- /begrüßung(?! text)/
- /(?<=sage )begrüßung/
- /(?<!sage )begrüßung/
- /bergland/gi
- /\(\d{3}\) \d{3}-\d{4}/g
- /begrüßung/gi
- /^begrüßung/gm
- /hello.world/s
- /[^\p{L}\p{N}]+/u
- /analysi[sz]e/g
- /kalend[ea]r/g
- /[^vwy]et/g
- /[2-6]00/g
- /[a-h]010290/g
- /\w+@\w+\.\w+/g
- /\d{3}-\d{2}-\d{4}/
- /b*/
- /b+/g
- /b{2,4}/g
- /the.+?on/
- /(cd)+/g
- /b.{3,5}c/g
- /b(c|d)e/g
- /\w+\+/g
- /^The/
- /\.$/
- /\b katze/gi
- /tion\b/gi
- /unternehmen|organisation/gi
- /(schnell|ruhig) (braun|grau) (fuchs|hund)/
- /(\d{2})\/(\d{2})\/(\d{4})/
- /\b(\w+)\b\s+\1/g
- /(?<first>\w+)\s(?<last>\w+)/
- /\w+(?=\sis)/g
- /(?<=the\s)\w+/gi
- /f\u00e9/u
- /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- /schnell/g
- /https?:\/\/\S+/g
- /[^a-zA-Z0-9]/g
- /\/kunden\/(\d+)/
