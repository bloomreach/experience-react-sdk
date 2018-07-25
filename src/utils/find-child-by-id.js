// returns parent and index of child referenced by ID,
// so that we can easily replace the child
export default function findChildById(object, id, parent, idx) {
  let result;
  for(let prop in object) {
    if(object.hasOwnProperty(prop)) {
      if(typeof object[prop] === "object") {
        result = findChildById(object[prop], id, object, prop);
        if(typeof result !== "undefined") {
          return result;
        }
      }
      else if(prop  === "id" && object.id === id) {
        return { parent: parent, idx: idx };
      }
    }
  }
}
