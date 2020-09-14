
export function validEstimation() {
  return [0.5,1,2,3,5,8,13];
}

export function closestEstimationValue(value) {
  let result, lastDelta;

  validEstimation().some((item) => {
      var delta = Math.abs(value - item);
      if (delta > lastDelta) {
          return true;
      }
      result = item;
      lastDelta = delta;
      return false;
    });

  return result;
}
