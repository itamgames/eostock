<template>
    <div class="backup contract">
        <div class="radio-group-tab">
            <ul>
                <li>
                    <input type="radio" id="deploy" value="deploy" v-model="checkContract" name="checkContract" checked/>
                    <label for="deploy">
                        <span v-html="$t('contract.deploy')">배포</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="run" value="run" v-model="checkContract" name="checkContract"/>
                    <label for="run">
                        <span v-html="$t('contract.run')">실행</span>
                    </label>
                </li>
            </ul>
        </div>
        <div v-if="checkContract === 'deploy'" class="backup-import">
            <form @submit.prevent="deployContract">
                <fieldset class="input-file">
                    <input type="file" id="wasmFile" accept="application/wasm" ref="wasmFile"
                           @change="changeFileHandle('wasmFile')"/>
                    <span v-if="!wasmFile.name">{{ $t('deployContract').wasmFile }}</span>
                    <span v-else>{{wasmFile.name}}</span>
                    <label for="wasmFile">{{ $t('button').file }}</label>
                </fieldset>

                <fieldset class="input-file">
                    <input type="file" id="abiFile" accept="application/abi" ref="abiFile"
                           @change="changeFileHandle('abiFile')"/>
                    <span v-if="!abiFile.name">{{ $t('deployContract').abiFile }}</span>
                    <span v-else>{{abiFile.name}}</span>
                    <label for="abiFile">{{ $t('button').file }}</label>
                </fieldset>
                <p class="warning">{{ $t('deployContract').description }}</p>

                <ul class="col-row col-l-r">
                    <li class="col-1-1">
                        <button type="submit" class="btn submit">
                            <span>{{ $t('button').deploy }}</span>
                        </button>
                    </li>
                </ul>
            </form>
        </div>
        <div v-else class="backup-import align-left">
            <div v-if="actions.length > 0">
                <form @submit.prevent="runAction">
                    <h3 class="m-b-5">Actions</h3>
                    <div class="select">
                        <button type="button" class="select-selected"
                                :class="{ on: isActionActive }"
                                @click="isActionActive = !isActionActive">
                            {{ selectedAction.name }}
                            <i class="icon-arrow-down"></i>
                        </button>
                        <dropdown v-model="isActionActive" :autoCloseOut="true">
                            <ul class="select-list on">
                                <li v-for="(action, key) of actions" :key="key">
                                    <button type="button"
                                            class="btn select"
                                            :class="{ on: action.name === selectedAction.name }"
                                            @click="actionSelect( action )">
                                        <span>{{ action.name }}</span>
                                    </button>
                                </li>
                            </ul>
                        </dropdown>
                    </div>

                    <div class="DH25"></div>

                    <h3 class="m-b-5">Enter Data</h3>
                    <ul class="contract-data">
                        <li v-for="field of selectedAction.fields">
                            <label>
                                <span>{{field}}</span>
                                <input type="text" v-model="actionParameters[field]" class="block-input" />
                            </label>
                        </li>
                    </ul>

                    <div class="DH15"></div>

                    <button type="button" @click="runAction" class="btn submit">
                        <span>Push Transition</span>
                    </button>
                </form>
            </div>
            <div v-else v-html="$t('contract.errorHasActions')"></div>
        </div>
        <div class="DH25"></div>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import dropdown from '@/common/components/dropdown/dropdown.component.vue';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'actions',
            ]),
        },
        components: {
            dropdown,
        },
    })
    export default class DeployContract extends Vue {
        checkContract: string = 'deploy';
        isActionActive: boolean = false;
        wasmFile: any = {};
        abiFile: any = {};
        selectedAction: any = {};
        actionParameters: any = {};

        deployContract() {
            if (!this.wasmFile.buffer || !this.abiFile.buffer) {
                this.$store.dispatch('setErrorModal', {error: this.$i18n.t('error.checkFile')});
                return;
            }

            this.$store.dispatch('deployContract', {abiFile: this.abiFile.buffer, wasmFile: this.wasmFile.buffer});
        }

        changeFileHandle(fileType: string) {
            const fileEl: any = this.$refs[fileType];
            const file = fileEl.files[0];
            const self: any = this;
            if (file) {
                const fileSplit = file.name.split('.');
                const exists = fileType === 'wasmFile' ? 'wasm' : 'abi';
                if (fileSplit[fileSplit.length - 1] !== exists) {
                    this.$store.dispatch('setErrorModal', {error: this.$i18n.t('error.exists', {exists})});
                    return;
                }
                self[fileType] = file;

                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = () => {
                    const arrayBuffer: any = fileReader.result;
                    self[fileType].buffer = Buffer.from(arrayBuffer);
                };
            }
        }

        runAction() {
            this.$store.dispatch('runAction', {action: this.selectedAction.name, data: this.actionParameters});
        }

        async actionSelect(action: any) {
            if (this.selectedAction.name !== action.name) {
                this.selectedAction = action;
            }

            this.isActionActive = false;
        }

        async initAction() {
            if (this.checkContract === 'run') {
                await this.$store.dispatch('getContract');
                const firstAction = this.$store.getters.actions[0];
                this.selectedAction = firstAction ? firstAction : {};
            }
        }

        @Watch('checkContract')
        changeTab() {
            this.initAction();
        }
    }
</script>
