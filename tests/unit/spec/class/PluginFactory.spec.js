/* eslint-disable max-classes-per-file */
import PluginFactory from '@/class/PluginFactory';
import PluginBase from '@/plugins/PluginBase';
import { DialogPlugin } from '@/plugins/DialogPlugin';
import { MessengerGroupPlugin } from '@/plugins/MessengerGroupPlugin';
import PluginApiTrait from '@/class/PluginApiTrait';
import { CONTEXT } from '@/constants';

describe('plugin manager', () => {
  class PluginClass extends PluginBase {
    static get pluginName() {
      return 'testPlugin';
    }

    static get dependencyPlugins() {
      return [DialogPlugin, MessengerGroupPlugin];
    }

    constructor(props, context) {
      super(props, context);
      this.init = jest.fn();
    }
  }

  class TestPluginNoName extends PluginBase {
    static get dependencyPlugins() {
      return [DialogPlugin, MessengerGroupPlugin];
    }
  }

  const options = {widget: false};

  const ExternalPlugin = PluginFactory.create(PluginClass);

  it('should create Plugin class', () => {
    const plugin = new ExternalPlugin(options);

    expect(plugin[CONTEXT].plugins.testPlugin).toBeInstanceOf(PluginClass);
    expect(plugin[CONTEXT].plugins.testPlugin.init).toBeCalled();
    expect(plugin).toBeInstanceOf(PluginApiTrait);
  });

  it('should throw error, if not defined name of plugin', () => {
    try {
      const PluginClassNoName = PluginFactory.create(TestPluginNoName);
      const plugin = new PluginClassNoName(options);
    } catch (e) {
      const err = new Error('Please define plugin name');

      expect(e).toEqual(err);
    }
  });

  it('should throw error, if trying to get not defined plugin', () => {
    const plugin = new ExternalPlugin(options);

    try {
      // eslint-disable-next-line
      plugin[CONTEXT].plugins.noPlugin;
    } catch (e) {
      const err = new Error(`Please define 'noPlugin' plugin`);

      expect(e).toEqual(err);
    }
  });
});