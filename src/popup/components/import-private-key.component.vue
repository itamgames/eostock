<template>
    <div class="cell">
        <h5>{{ $t('signUp').step2Title }}</h5>
        <div class="DH25"></div>
        <form @submit.prevent="importPrivateKey">
            <div class="select net-select">
                <button type="button" class="select-selected"
                        :class="{ on: isOpenNet }"
                        @click="toggleNetworks">
                    {{ network.name }}
                    <i class="icon-arrow-down"></i>
                </button>
                <dropdown v-model="isOpenNet" :autoCloseOut="true">
                    <ul class="select-list on">
                        <li v-for="(net, key) in networks" :key="key">
                            <button type="button"
                                    class="btn select"
                                    :class="{ on: net.name === network.name, shot: !supportNetworks[net.name]}"
                                    @click="selectChangeNet( net )">
                                <span>{{ net.name }}</span>
                            </button>
                            <button type="button" class="btn btn-del"
                                    v-if="!supportNetworks[net.name]"
                                    :class="{ on: net.name === network.name }"
                                    @click="removeCustom(net.name)">
                                <span><i class="icon icon-del"></i></span>
                            </button>
                        </li>
                        <li>
                            <button type="button"
                                    class="btn select hover-underline"
                                    @click="addNet()">
                                <span>Custom Network</span>
                            </button>
                        </li>
                    </ul>
                </dropdown>
            </div>
            <div>
                <input type="password" class="block-input" v-model="privateKey"
                       :placeholder="$t('signUp').userPrivateKey">
            </div>
            <div class="error">
                <span v-if="error">{{$t('signUp')[error]}}</span>
            </div>
            <p class="private-ment" v-html="$t('account').script"></p>
            <div class="sign-body__submit">
                <span><button type="submit" class="btn submit"><span>{{ $t('signUp').checkPrivateKey }}</span></button></span>
            </div>
        </form>

        <modal v-model="isCustomNetwork">
            <h4 class="align-center">Custom Network</h4><br/>
            <form>
                <div>
                    <input type="text" class="block-input" placeholder="Main Symbol (ex. EOS)" id="capitalize"
                           v-model="customNet.symbol" maxlength="7">
                </div>
                <div>
                    <input type="text" class="block-input" placeholder="Name" v-model="customNet.name">
                </div>
                <div class="">
                    <div class="DH5"></div>
                    <div class="radio-group">
                        <input type="radio" id="https" name="chkLang" value="https" v-model="customNet.protocol"/>
                        <label for="https">
                            <span>https</span>
                        </label>

                        <input type="radio" id="http" name="chkLang" value="http" v-model="customNet.protocol"/>
                        <label for="http">
                            <span>http</span>
                        </label>
                    </div>
                    <br/>
                </div>
                <div>
                    <input type="text" class="block-input" placeholder="Domain or IP" v-model="customNet.domain">
                </div>
                <div>
                    <input type="number" class="block-input" placeholder="Port" v-model="customNet.port">
                </div>
                <div>
                    <input type="text" class="block-input" placeholder="Chain ID" v-model="customNet.chainId">
                </div>
                <div class="align-center">
                    <button type="button"
                            class="btn submit"
                            @click="addCustom()">
                        <span>Save</span>
                    </button>
                </div>
            </form>
        </modal>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Network } from '../store/modules/account/account.interface';
    import modal from '@/common/components/modal/modal.component.vue';
    import dropdown from '@/common/components/dropdown/dropdown.component.vue';
    import { mapGetters } from 'vuex';
    import { SUPPORT_NETWORK } from '@/common/config';

    @Component({
        computed: {
            ...mapGetters([
                'networks',
            ]),
        },
        components: {
            modal,
            dropdown,
        },
    })
    export default class ImportPrivateKey extends Vue {
        isCustomNetwork: boolean = false;
        isOpenNet: boolean = false;
        privateKey: string = '';
        error: string = '';
        network: Network = this.$store.getters.networks['EOS Mainnet'];
        supportNetworks = SUPPORT_NETWORK;

        customNet: any = {
            symbol: '',
            name: '',
            protocol: 'https',
            domain: '',
            port: '',
            chainId: '',
        };

        toggleNetworks() {
            this.isOpenNet = !this.isOpenNet;
        }

        selectChangeNet(selected: any) {
            this.network = selected;
            this.isOpenNet = false;
        }

        addNet() {
            this.isOpenNet = false;
            this.isCustomNetwork = true;
        }

        addCustom() {
            const custom = this.customNet;
            const keys = Object.keys(custom);
            for (const key of keys) {
                if (!custom[key]) {
                    this.$store.dispatch('setErrorModal', {error: this.$i18n.t(`error.required`)});
                    return;
                }
            }

            if (this.$store.getters.networks[custom.name]) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t(`error.sameNetworkName`)});
                return;
            }

            this.network = {
                name: custom.name,
                httpEndpoint: `${custom.protocol}://${custom.domain}${custom.port ? ':' + custom.port : ''}`,
                chainId: custom.chainId,
                symbol: custom.symbol,
            };
            this.isOpenNet = false;
            this.isCustomNetwork = false;
            this.$store.dispatch('addCustomNetwork', this.network);
            for (const key of keys) {
                custom[key] = '';
            }
        }

        removeCustom(networkName: string) {
            if (this.supportNetworks[networkName]) {
                return;
            }
            if (this.network.name === networkName) {
                this.network = this.$store.getters.networks['EOS Mainnet'];
            }
            this.$store.dispatch('deleteCustomNetwork', networkName);
        }

        async importPrivateKey() {
            this.error = '';

            if (this.privateKey) {
                try {
                    await this.$store.dispatch('getAccountsByKey', {
                        network: this.network,
                        privateKey: this.privateKey,
                    });

                    this.$emit('importPrivateKey', this.privateKey, this.network);
                } catch (e) {
                    this.error = 'checkPrivateKey';
                }
            } else {
                this.error = 'required';
            }
        }
    }
</script>
