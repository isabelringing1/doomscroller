export const instructionMatchers = {
  scroll_down: (action, instruction) =>
    action.type === 'scroll' &&
    action.direction === (instruction.type.params?.direction ?? 'down'),

  scroll_up: (action) =>
    action.type === 'scroll' && action.direction === 'up',

  like: (action) =>
    action.type === 'button' && action.name === 'like',

  share: (action) =>
    action.type === 'button' && action.name === 'share',

  comment: (action) =>
    action.type === 'button' && action.name === 'comment',

  save: (action) =>
    action.type === 'button' && action.name === 'save',
}
