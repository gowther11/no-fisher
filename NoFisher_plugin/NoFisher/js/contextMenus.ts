import CreateProperties = chrome.contextMenus.CreateProperties;

export {Menu, defaultMenu};
export {createMenu};
export {collectMenuCreateProperties};


/**
 *  一系列创建 {@link contextMenus} 需要的数据
 *  @see defaultMenu
 */
interface Menu {
  createProperties: CreateProperties;
  children?: Menu[];
}

/**
 *  默认的的数据  ：
 *  [{"id":"main","visible":true,"title":"main"},
 *  {"id":"sub1","visible":true,"title":"sub1","parentId":"main"},
 *  {"id":"sub11","visible":true,"title":"sub11","parentId":"sub1"},
 *  {"id":"sub12","visible":true,"title":"sub12","parentId":"sub1"},
 *  {"id":"sub2","visible":true,"title":"sub2","parentId":"main"}]
 */
const defaultMenu: Menu = {
  createProperties: {
    id: 'main',
    visible: true,
    title: 'main'
  },
  children: [
    {
      createProperties: {
        id: 'sub1',
        visible: true,
        title: 'sub1',

      },
      children: [
        {
          createProperties: {
            id: 'sub11',
            visible: true,
            title: 'sub11',
          }
        },
        {
          createProperties: {
            id: 'sub12',
            visible: true,
            title: 'sub12',
          }
        }
      ]
    },
    {
      createProperties: {
        id: 'sub2',
        visible: true,
        title: 'sub2',
      }
    }
  ]
};


/**
 * 主要方法
 * 创建 contextMenus
 * 1 监听 {@link  chrome.runtime}事件，事件的实体可能是：（"install", "update", "chrome_update", or "shared_module_update"）
 * 2 移除之前创建的所有 {@link  chrome.contextMenus}
 * 3 执行创建
 *
 * @param menu 执行创建的上下文信息
 * @see Menu
 * @see defaultMenu
 */
function createMenu(menu: Menu = defaultMenu): void {
  chrome.runtime.onInstalled.addListener(details => {
    const properties: CreateProperties[] = collectMenuCreateProperties(menu);
    // alert(JSON.stringify(properties));
    properties.forEach(property => {
      chrome.contextMenus.create(property);
    });

  });
}

/**
 * 递归方式返回 parent 中包含的{@link CreateProperties} 对象，
 * 每一层的 {@link CreateProperties.id} 必须不为空
 * 并以编码的方式保证： 第二层开始， {@link CreateProperties.parentId} 被正确设置
 *
 * @param parent 顶层
 */
function collectMenuCreateProperties(parent: Menu): CreateProperties[] {
  if (parent.createProperties.id === undefined) {
    throw  new Error('parent contextMenu must has id');
  }
  let result: CreateProperties[] = [];
  result.push(parent.createProperties);
  if (parent.children) {
    parent.children.forEach(child => {
      // 确保每一层的层级关系
      child.createProperties.parentId = parent.createProperties.id;
      result = result.concat(collectMenuCreateProperties(child));
    });
  }
  return result;
}

function shieldOneItem(item : HTMLElement , style : number, level :number){
  switch (style){
    case 1:
        item.style.display = "none";
        break;
    case 2:
        item.style.textDecoration = "line-through";
        break;
    case 3:
        item.style.color = "grey";
        break;
    case 4:
        item.style.opacity = "0.3";
        break;
    default:
        break;
  }
  var div = new HTMLElement();
  var c = div.childElementCount;
  div.children
}