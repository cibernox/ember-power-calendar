import Component from '@glimmer/component';
import RouteTemplate from 'ember-route-template';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
class Application extends Component {
  <template>
    {{outlet}}

    <BasicDropdownWormhole />
  </template>
}

export default RouteTemplate(Application);
