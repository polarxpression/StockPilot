import { Cartridge } from "./types";

// #region: Parser
// Simple tokenizer
const tokenize = (query: string): string[] => {
  const tokens = query.match(/"[^"]+"|\S+/g) || [];
  return tokens.flatMap(token => {
    if (token.startsWith('"') && token.endsWith('"')) {
      return token;
    }
    return token.split(/([()~])/).filter(Boolean);
  });
};

// Shunting-yard algorithm to convert infix to postfix (RPN)
const toPostfix = (tokens: string[]): string[] => {
    const precedence: { [key: string]: number } = { 'OR': 1, '~': 1, 'AND': 2 };
    const output: string[] = [];
    const operators: string[] = [];

    let lastTokenWasOperand = false;

    for (const token of tokens) {
        if (token.trim() === '') continue;

        if (token === '(') {
            if (lastTokenWasOperand) {
                operators.push('AND');
            }
            operators.push(token);
            lastTokenWasOperand = false;
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop()!);
            }
            operators.pop(); // Pop '('
            lastTokenWasOperand = true;
        } else if (precedence[token.toUpperCase()]) {
            const op = token.toUpperCase();
            while (
                operators.length &&
                operators[operators.length - 1] !== '(' &&
                precedence[operators[operators.length - 1]] >= precedence[op]
            ) {
                output.push(operators.pop()!);
            }
            operators.push(op);
            lastTokenWasOperand = false;
        } else { // Operand
            if (lastTokenWasOperand) {
                operators.push('AND');
            }
            output.push(token);
            lastTokenWasOperand = true;
        }
    }

    while (operators.length) {
        output.push(operators.pop()!);
    }

    return output;
};
// #endregion

// #region: Evaluator
const evaluateTerm = (cartridge: Cartridge, term: string): boolean => {
  term = term.trim();
  if (!term) return true;

  // Handle quoted exact match
  if (term.startsWith('"') && term.endsWith('"')) {
    const exactTerm = term.substring(1, term.length - 1).toLowerCase();
    const searchableFields = ['brand', 'model', 'color'];
    return searchableFields.some(field => {
        const value = cartridge[field as keyof Cartridge];
        return typeof value === 'string' && value.toLowerCase().trim() === exactTerm;
    });
  }

  let negate = false;
  if (term.startsWith('-')) {
    negate = true;
    term = term.substring(1);
  }

  // Field-specific search (e.g., score:>50)
  const fieldMatch = term.match(/^([a-z_]+):(.+)$/);
  if (fieldMatch) {
    const [, field, value] = fieldMatch;
    return evaluateFieldSearch(cartridge, field, value, negate);
  }

  // General tag search
  const result = evaluateGeneralTagSearch(cartridge, term);
  return negate ? !result : result;
};

const evaluateFieldSearch = (cartridge: Cartridge, field: string, value: string, negate: boolean): boolean => {
  const operatorMatch = value.match(/^(>=|<=|>|<|=)?(.+)$/);
  if (!operatorMatch) return false;

  const [, op, valStr] = operatorMatch;
  const operator = op || '=';
  const valNum = parseFloat(valStr);

  const cartridgeValue = cartridge[field as keyof Cartridge];

  let result = false;

  if (typeof cartridgeValue === 'number' && !isNaN(valNum)) {
    switch (operator) {
      case '>=': result = cartridgeValue >= valNum; break;
      case '<=': result = cartridgeValue <= valNum; break;
      case '>': result = cartridgeValue > valNum; break;
      case '<': result = cartridgeValue < valNum; break;
      case '=': result = cartridgeValue === valNum; break;
    }
  } else if (typeof cartridgeValue === 'string') {
    if (valStr.includes('*')) {
      const regex = new RegExp(`^${valStr.replace(/\*/g, '.*')}$`, 'i');
      result = regex.test(cartridgeValue.trim());
    } else {
      result = cartridgeValue.toLowerCase().trim() === valStr.toLowerCase();
    }
  } else if (typeof cartridgeValue === 'boolean') {
    result = cartridgeValue === (valStr === 'true');
  }

  return negate ? !result : result;
};

const evaluateGeneralTagSearch = (cartridge: Cartridge, term: string): boolean => {
  const searchableFields = ['brand', 'model', 'color'];
  const lowerTerm = term.toLowerCase();

  if (lowerTerm.includes('*')) {
    const regex = new RegExp(`^${lowerTerm.replace(/\*/g, '.*')}$`, 'i');
    return searchableFields.some(field => {
      const value = cartridge[field as keyof Cartridge];
      return typeof value === 'string' && regex.test(value.trim());
    });
  }

  return searchableFields.some(field => {
    const value = cartridge[field as keyof Cartridge];
    return typeof value === 'string' && value.toLowerCase().trim().includes(lowerTerm);
  });
};

const evaluatePostfix = (postfix: string[], cartridge: Cartridge): boolean => {
  const stack: boolean[] = [];

  for (const token of postfix) {
    if (token === 'AND') {
      const right = stack.pop() ?? false;
      const left = stack.pop() ?? false;
      stack.push(left && right);
    } else if (token === 'OR' || token === '~') {
      const right = stack.pop() ?? false;
      const left = stack.pop() ?? false;
      stack.push(left || right);
    } else {
      stack.push(evaluateTerm(cartridge, token));
    }
  }
  return stack[0] ?? false;
};
// #endregion

// #region: Main Filter Function
export const filterCartridges = (cartridges: Cartridge[], searchTerm: string): Cartridge[] => {
  if (!searchTerm) {
    return cartridges;
  }

  // Extract order: term
  let order: { field: string, direction: 'asc' | 'desc' } | null = null;
  const orderMatch = searchTerm.match(/order:(\w+)( (asc|desc))?/);
  if (orderMatch) {
    searchTerm = searchTerm.replace(orderMatch[0], '').trim();
    order = {
      field: orderMatch[1],
      direction: (orderMatch[3] as 'asc' | 'desc') || 'asc'
    };
  }

  // Extract ?random term
  let random = false;
  if (searchTerm.includes('?random')) {
    random = true;
    searchTerm = searchTerm.replace('?random', '').trim();
  }

  const tokens = tokenize(searchTerm);
  const postfix = toPostfix(tokens);

  const filtered = cartridges.filter(cartridge => evaluatePostfix(postfix, cartridge));

  if (order) {
    filtered.sort((a, b) => {
      const aValue = a[order!.field as keyof Cartridge];
      const bValue = b[order!.field as keyof Cartridge];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue < bValue) return order!.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return order!.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (random) {
    // Shuffle the array
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
  }

  return filtered;
};
// #endregion
