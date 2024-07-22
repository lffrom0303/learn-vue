import { isReserved, getOuterHTML } from "../util/index";
import { compile } from "../compiler/index";
import Watcher from "../observer/watcher";
import { h, patch } from "../vdom";
export default function Component(options) {
  // 初始化配置
  this.$options = options;
  this._data = options.data;
  console.log("初始化配置options、data");
  const el = (this._el = document.querySelector(options.el));
  this._el.innerHTML = "";
  console.log("初始化配置el、dom");
  // 解析DOM
  let dom = getOuterHTML(el);
  console.log("通过getOuterHTML方法，得到根节点字符串", dom);
  const render = compile(dom);
  console.log("得到了生成新建根节点html结构函数", render);
  // 处理数据
  Object.keys(options.data).forEach((key) => _proxy(this, key));
  console.log("处理数据完毕");
  // 处理函数
  if (options.methods) {
    Object.keys(options.methods).forEach((key) => {
      this[key] = options.methods[key].bind(this);
    });
  }
  console.log("处理函数完毕");
  // 创建监听者数组
  this._watchers = [];
  console.log("创建监听者数组", this._watchers);
  // 创建一个监听者
  console.log(
    "创建一个监听者Watcher(传入当前组件实例this, 生成新建根节点dom结构函数, 更新函数cb, options) {}"
  );
  this._watcher = new Watcher(this, render, this._update);
  console.log("7、创建一个监听者完毕", "创建监听者数组=>", this._watchers);
  console.log(
    "初始化执行一次this._update,传入this._watcher.value",
    this._watcher.value
  );
  this._update(this._watcher.value);
  console.log("更新后的vtree", this._tree);
  /**
   * 更新虚拟树。
   *
   * 此方法负责比较当前的虚拟树（如果存在）与新提供的虚拟树，并根据差异应用更新到实际的DOM元素上。
   * 如果当前没有虚拟树，那么直接将新虚拟树应用于DOM元素。否则，对当前虚拟树和新虚拟树进行补丁更新。
   * 这一过程是虚拟DOM算法的核心部分，它通过最小化DOM操作来提高性能。
   *
   * @param {Object} vtree 新的虚拟树对象，代表了应该呈现的DOM结构。
   */
}
Component.prototype._update = function (vtree) {
  console.log("vtree", vtree);
  // 检查当前是否有虚拟树，如果没有，则直接将新虚拟树应用于DOM
  if (!this._tree) {
    patch(this._el, vtree);
  } else {
    // 如果已经有虚拟树，则对当前虚拟树和新虚拟树进行比较并应用更新
    patch(this._tree, vtree);
  }
  // 更新当前的虚拟树为新虚拟树，以便下次比较使用
  this._tree = vtree;
};

function _proxy(vm, key) {
  if (!isReserved(key)) {
    // need to store ref to self here
    // because these getter/setters might
    // be called by child scopes via
    // prototype inheritance.
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        console.log("proxyGetter");
        return vm._data[key];
      },
      set: function proxySetter(val) {
        console.log("proxySetter", val);
        vm._data[key] = val;
      },
    });
  }
}
Component.prototype.__h__ = h;
