export default eventHandler(async (event) => {
  const data = await readFormData(event);

  const file = data.get("file");

  console.log(file);

  return "Uni ECharts c2e!";
});