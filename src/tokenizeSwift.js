/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  AfterFunctionName: 14,
  InsideDoubleQuoteString: 15,
}

export const StateMap = {
  [State.TopLevelContent]: 'TopLevelContent',
}

/**
 * @enum number
 */
export const TokenType = {
  Whitespace: 2,
  Punctuation: 3,
  CurlyOpen: 6,
  CurlyClose: 7,
  PropertyColon: 8,
  Variable: 10,
  None: 57,
  Unknown: 881,
  Numeric: 883,
  NewLine: 884,
  Comment: 885,
  Text: 887,
  FuntionName: 890,
  String: 891,
  KeywordImport: 892,
}

export const TokenMap = {
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.CurlyOpen]: 'Punctuation',
  [TokenType.CurlyClose]: 'Punctuation',
  [TokenType.PropertyColon]: 'Punctuation',
  [TokenType.Variable]: 'VariableName',
  [TokenType.None]: 'None',
  [TokenType.Unknown]: 'Unknown',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Comment]: 'Comment',
  [TokenType.Text]: 'Text',
  [TokenType.FuntionName]: 'Function',
  [TokenType.String]: 'String',
  [TokenType.KeywordImport]: 'KeywordImport',
}

const RE_WHITESPACE = /^\s+/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_COLON = /^:/
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_ANYTHING = /^.+/s
const RE_NUMERIC = /^\-?(([0-9]+\.?[0-9]*)|(\.[0-9]+))/
const RE_ANYTHING_UNTIL_CLOSE_BRACE = /^[^\}]+/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_BLOCK_COMMENT_CONTENT = /^.+?(?=\*\/|$)/s
const RE_ROUND_OPEN = /^\(/
const RE_ROUND_CLOSE = /^\)/
const RE_PSEUDO_SELECTOR_CONTENT = /^[^\)]+/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_STAR = /^\*/
const RE_FUNCTION = /^[a-zA-Z][a-zA-Z\-]+(?=\()/
const RE_VARIABLE_NAME = /^\-\-[a-zA-Z\w\-\_]+/
const RE_PERCENT = /^\%/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^']+/
const RE_SINGLE_QUOTE = /^'/
const RE_ANYTHING_BUT_CURLY = /^[^\{\}]+/s
const RE_PUNCTUATION = /^[\.:\(\)]/
const RE_VERTICAL_LINE = /^\|/
const RE_SLASH = /^\//

export const initialLineState = {
  state: State.TopLevelContent,
  tokens: [],
  stack: [],
}

/**
 * @param {any} lineStateA
 * @param {any} lineStateB
 */
export const isEqualLineState = (lineStateA, lineStateB) => {
  return lineStateA.state === lineStateB.state
}

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  const stack = lineState.stack
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Unknown
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsideDoubleQuoteString:
        if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = stack.pop() || State.TopLevelContent
        } else if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else {
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
    stack,
  }
}
