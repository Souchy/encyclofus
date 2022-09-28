import { render } from './helper';
import { App } from '../src/app';

describe('app', () => {
  it('should render message', async () => {
    const node = (await render('<app></app>', App)).firstElementChild;
    const text =  node.textContent;
    expect(text.trim()).toBe('Hello World!');
  });
});
