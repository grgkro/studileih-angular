export interface ResponseEntity<T> {
    headers: { [headerName: string]: string },
    body: T,
    statusCode: "OK" | "SERVER_ERROR" | "BAD_REQUEST", //etc
    statusCodeValue: "200" | "500" | "400" | "404" //etc
 }